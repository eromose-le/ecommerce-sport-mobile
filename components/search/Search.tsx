import { BackButton } from "@/components/common/BackButton";
import { PRODUCT_DETAIL } from "@/constants/urls";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../common/EmptyState";
import { LoadingContent } from "../common/LoadingContent";

export default function Search() {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

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
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row gap-2 px-4 pb-3">
        <BackButton />
        <View className="flex-row flex-1 items-center px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            ref={inputRef}
            placeholder="Type your search here"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-primary font-jost"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 52 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
        >
          <LoadingContent
            loading={isLoading || isFetching}
            loadingClassName="flex absolute p-0 m-0 left-44"
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
                  className="flex-row items-center py-3 border-b border-[#F1F5F9]"
                  onPress={() => handleSelect(product)}
                  activeOpacity={0.8}
                >
                  <View className="items-center justify-center w-12 h-12 mr-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    {product.displayImage ? (
                      <Image
                        source={{ uri: product.displayImage }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="cube-outline" size={20} color="#9CA3AF" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-jost-medium text-primary">
                      {product.name}
                    </Text>
                    <Text className="text-xs text-secondary font-jost">
                      ₦{Number(product.price || 0).toLocaleString()}
                    </Text>
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
