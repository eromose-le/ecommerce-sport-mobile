import { useAuth } from "@/providers/auth";
import { OrderService, PaymentService } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import { Logger } from "@/utils/logger";
import { AppToast } from "@/utils/toast";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const extractReference = (url?: string) => {
  if (!url) return undefined;
  const parsed = Linking.parse(url);
  const ref =
    (parsed?.queryParams?.reference as string | undefined) ||
    (parsed?.queryParams?.trxref as string | undefined);
  return ref;
};

export default function PaystackWebView() {
  const params = useLocalSearchParams<{
    url?: string;
    reference?: string;
    backendReference?: string;
    redirectUrl?: string;
    callbackUrl?: string;
    metadata?: string;
    payableAmount?: string;
    checkoutAmount?: string;
    shippingFee?: string;
    shippingState?: string;
    paymentOption?: string;
  }>();

  const webUrl = params?.url;
  const initialReference = params?.reference;
  const backendReference = params?.backendReference;
  const redirectUrl = params?.redirectUrl as string | undefined;
  const callbackUrl = params?.callbackUrl as string | undefined;
  const metadata = useMemo(() => {
    try {
      return params?.metadata ? JSON.parse(params.metadata) : {};
    } catch (error) {
      return error;
    }
  }, [params?.metadata]);

  const payableAmount = Number(params?.payableAmount || 0);
  const checkoutAmount = Number(params?.checkoutAmount || 0);
  const shippingFee = Number(params?.shippingFee || 0);
  const shippingState = params?.shippingState;
  const paymentOption =
    (params?.paymentOption as "FULL" | "PARTIAL" | undefined) || "FULL";

  const [webLoading, setWebLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const hasCompleted = useRef(false);
  const lastKnownReference = useRef<string | undefined>(initialReference);

  const { user } = useAuth();
  const { clearCart } = useCartStore();

  const handleFinalize = async (refFromUrl?: string) => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    const finalReference = refFromUrl || lastKnownReference.current;
    if (!finalReference) {
      AppToast.failed("Unable to confirm payment reference.");
      router.back();
      return;
    }

    try {
      setProcessing(true);
      const transactionLog = {
        reference: finalReference,
        redirecturl: webUrl,
      };

      const verifyResponse = await PaymentService.finalizePayment({
        reference: finalReference,
        backendReference,
        metadata,
        transactionLog,
      });

      Logger.warn("Start verifyResponse", {
        transactionLog,
        verifyResponse,
      });

      if (verifyResponse?.success === false) {
        throw new Error(
          verifyResponse?.message || "Payment verification failed."
        );
      }

      const orderPayload = {
        userId: user?.id,
        items: metadata?.items?.items || [],
        variant: metadata?.items?.variant,
        paymentOption,
        amountToPay: payableAmount,
        checkoutAmount,
        shippingFee,
        shippingState,
        paymentReference: finalReference,
        backendReference,
        paymentGateway: "PAYSTACK",
        partialPercentage: metadata?.partialPercentage,
        offlineUser: metadata?.offlineUser,
        metadata,
      };

      const orderResponse = await OrderService.createOrderData(orderPayload);

      if (orderResponse?.success === false) {
        throw new Error(
          orderResponse?.message || "Order creation failed after payment."
        );
      }

      AppToast.success(
        orderResponse?.message ||
          verifyResponse?.message ||
          "Payment verified and order created."
      );
      clearCart();
      router.replace("/(protected)/(tabs-protected)");
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Unable to finalize payment.";
      AppToast.failed(msg);
      router.back();
    } finally {
      setProcessing(false);
    }
  };

  const isAppRedirect = (url?: string) => {
    if (!url) return false;
    const normalized = url.toLowerCase();
    const redirect = redirectUrl?.toLowerCase() || "";
    const callback = callbackUrl?.toLowerCase() || "";
    return (
      (!!redirect && normalized.startsWith(redirect)) ||
      (!!callback && normalized.startsWith(callback))
    );
  };

  const handleNavigation = (url?: string) => {
    if (!url || processing) return false;
    const ref = extractReference(url);
    if (ref) {
      lastKnownReference.current = ref;
    }

    if (ref || isAppRedirect(url)) {
      handleFinalize(ref);
      return true;
    }

    const lower = url.toLowerCase();
    if (lower.includes("cancel") || lower.includes("closed")) {
      AppToast.failed("Payment was cancelled.");
      router.back();
      return true;
    }

    return false;
  };

  if (!webUrl) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text className="text-base">No payment url provided.</Text>
      </SafeAreaView>
    );
  }

  Logger.warn("Out paystack webview", {
    hasCompleted: hasCompleted.current,
    webUrl,
    initialReference,
    processing,
    webLoading,
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <WebView
          source={{ uri: webUrl }}
          onNavigationStateChange={(state) => handleNavigation(state.url)}
          onShouldStartLoadWithRequest={(request) => {
            const intercepted = handleNavigation(request.url);
            return !intercepted;
          }}
          onLoadStart={() => setWebLoading(true)}
          onLoadEnd={() => setWebLoading(false)}
          startInLoadingState
        />
        {(webLoading || processing) && (
          <View className="absolute inset-0 z-10 items-center justify-center bg-white/70">
            <ActivityIndicator size="large" color="#000" />
            <Text className="mt-2 text-sm">
              {processing ? "Finalizing payment..." : "Loading checkout..."}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
