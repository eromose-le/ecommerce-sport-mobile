import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import CartButton from "@/components/cart/CartButton";
import ProductAttributes from "@/components/product/ProductAttributes";
import ProductDetailActions from "@/components/product/ProductDetailActions";
import ProductGallery from "@/components/product/ProductGallery";
import ProductReviews from "@/components/product/ProductReviews";
import ReviewModal from "@/components/review/ReviewModal";
import { formatCurrency } from "@/utils/currency";
import { Logger } from "@/utils/logger";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../common/AppHeader";
import ProductSpecifications from "./ProductSpecifications";

export default function ProductDetail() {
  const { product } = useLocalSearchParams<{
    id?: string;
    product?: any[];
  }>() as any;
  const item = JSON.parse(product);
  const productId = item?.id || item?._id;
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  Logger.warn("item", item);
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-white">
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          {/* Header */}
          <AppHeader
            title={`Product ${item.modelNumber}`}
            right={<CartButton />}
          />

          <ProductGallery images={item?.medias?.[0]?.images} />

          {/* TITLE / DESCRIPTION */}
          <View className="px-4 mt-5">
            <Text className="text-2xl font-jost-medium">{item?.name}</Text>

            <Text className="mt-1 text-sm leading-4 font-jost text-secondary">
              {item?.description}
            </Text>

            {/* Variations */}
            <View className="mt-5">
              <Text className="text-sm text-primary font-jost-bold">
                Variations
              </Text>
              <Text className="text-[10px] text-primary">
                Total options: {item?.variations?.length ?? 1}
              </Text>

              <View className="flex-row items-center gap-2 mt-5">
                {item.variations?.map((color: string, i: number) => (
                  <View
                    key={i}
                    className="w-6 h-6 border rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
            </View>

            {/* Pricing & Quantity */}
            <View className="mt-4">
              <Text className="text-2xl font-jost-medium">
                {formatCurrency(item?.price)}
              </Text>

              <View className="flex-row items-center gap-3 mt-4">
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
                <Text className="text-base font-jost-medium">1</Text>
                <TouchableOpacity className="bg-black rounded-full ">
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <ProductDetailActions product={item} />
          </View>

          {/* KEY ATTRIBUTES */}
          <ProductAttributes attributes={item?.keyattribute} />

          <ProductSpecifications
            modelNumber={item?.modelNumber}
            specifications={item?.specification}
          />

          {/* REVIEWS */}
          <ProductReviews
            productId={productId}
            onAddReview={() => setIsReviewOpen(true)}
          />

          {productId ? (
            <ReviewModal
              visible={isReviewOpen}
              onClose={() => setIsReviewOpen(false)}
              productId={String(productId)}
              productName={item?.name}
            />
          ) : null}

          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
