import { BackButton } from "@/components/common/BackButton";
import { PRODUCT_DETAIL } from "@/constants/urls";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { ProductService } from "@/services/api";
import { TProduct } from "@/services/product/product.types";
import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../common/EmptyState";
import { LoadingContent } from "../common/LoadingContent";
import TextField from "../common/TextField";
import { BodyText } from "../ui";

export default function Search() {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const theme = useThemedStyles();
  const { isDark } = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(timeout);
  }, []);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["products", "global-search", debouncedQuery],
    queryFn: () =>
      ProductService.fetchProducts({
        limit: 10,
        ...(debouncedQuery ? { q: debouncedQuery } : {}),
      }),
    staleTime: 1000 * 30,
    retry: 1,
  });

  const productsResponse: TProduct[] = data?.data?.results || [];

  const handleSelect = (product: TProduct) => {
    try {
      router.push({
        pathname: PRODUCT_DETAIL,
        params: {
          id: String(product.id),
          product: JSON.stringify(product),
        },
      });
    } catch (err: any) {
      AppToast.failed("Unable to open product", err);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${theme.pageBg}`}>
      <View className="flex-row gap-2 px-4 pb-3">
        <View className="items-center justify-center h-fit">
          <BackButton />
        </View>
        <TextField
          ref={inputRef}
          label="Search products"
          hideLabel
          placeholder="Type your search here"
          keyboardType="email-address"
          autoCapitalize="none"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
          containerClassName="flex-1"
          leftIconName="search-outline"
          rightIconName={query.length ? "close-circle" : undefined}
          onRightIconPress={query.length ? () => setQuery("") : undefined}
          rightIconDisabled={!query.length}
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 10, android: 10 })}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
        >
          <LoadingContent
            loading={isLoading || isFetching}
            loadingClassName="flex-1 flex-col items-center justify-center"
            error={error}
            onRetry={refetch}
            data={productsResponse}
            EmptyComponent={(error, onRetry) => (
              <View className="items-center">
                <EmptyState
                  icon={
                    <Ionicons
                      name={"bag-handle-outline"}
                      size={38}
                      color="#ddd"
                    />
                  }
                  error="No product found"
                  onRetry={onRetry}
                />
              </View>
            )}
            // LoadingComponent={<ActivityIndicator size="small" />}
            // ErrorComponent={(error, refetch) => (
            //   <View className="flex-row items-center gap-2">
            //     <Text className="text-xs text-[#ef4444]">{error?.message}</Text>
            //     <TouchableOpacity onPress={refetch}>
            //       <Ionicons name="reload-outline" size={12} color="#ef4444" />
            //     </TouchableOpacity>
            //   </View>
            // )}
          >
            <>
              {productsResponse?.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  className="flex-row items-center py-3 border-b"
                  style={{ borderColor: isDark ? "#1f2937" : "#F1F5F9" }}
                  onPress={() => handleSelect(product)}
                  activeOpacity={0.8}
                >
                  <View
                    className="items-center justify-center w-12 h-12 mr-3 overflow-hidden rounded-full"
                    style={{ backgroundColor: isDark ? "#111827" : "#F1F5F9" }}
                  >
                    {product.displayImage ? (
                      <Image
                        source={{ uri: product.displayImage }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons
                        name="cube-outline"
                        size={20}
                        color={theme.iconMuted}
                      />
                    )}
                  </View>
                  <View className="flex-1">
                    <BodyText
                      size="md"
                      weight="medium"
                      tone={theme.headingTone}
                    >
                      {product.name}
                    </BodyText>
                    <BodyText size="xs" tone={theme.labelTone}>
                      ₦{Number(product.price || 0).toLocaleString()}
                    </BodyText>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          </LoadingContent>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
