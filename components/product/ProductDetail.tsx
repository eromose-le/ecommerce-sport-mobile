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
import { accumulateAmounts } from "@/helpers/accumulate-amounts";
import { ProductService } from "@/services/api";
import { Product } from "@/services/product/product.types";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/currency";
import { Logger } from "@/utils/logger";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { Formik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import AppHeader from "../common/AppHeader";
import AppLoader from "../common/AppLoader";
import ProductSpecifications from "./ProductSpecifications";

export default function ProductDetail() {
  const params = useLocalSearchParams<{
    id?: string;
    product?: any[];
  }>() as any;

  const initialItem = params?.product ? JSON.parse(params.product) : null;
  const productId = params?.id || initialItem?.id;
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { addToCart } = useCartStore();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductService.fetchProductById(String(productId)),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
    initialData: !productId ? { data: initialItem } : undefined,
  });

  const item: Product = (data as any)?.data || initialItem || {};

  // ----- Variants -----
  type Option = { label: string; price?: number };

  const mapOptions = (arr: any[] = [], keys: string[]): Option[] =>
    arr
      .map((entry: any) => {
        if (typeof entry === "string") return { label: entry, price: 0 };
        for (const key of keys) {
          const value = entry?.[key];
          if (typeof value === "string")
            return { label: value, price: entry?.price ?? 0 };
          if (value?.name)
            return {
              label: value.name,
              price: entry?.price ?? value?.price ?? 0,
            };
        }
        if (entry?.name) return { label: entry.name, price: entry?.price ?? 0 };
        return null;
      })
      .filter(Boolean) as Option[];

  const colorOptions = mapOptions(item?.colors || item?.variants, ["color"]);
  const sizeOptions = mapOptions(item?.sizes || item?.variants, ["size"]);
  const weightOptions = mapOptions(item?.weights || item?.variants, ["weight"]);
  const dimensionOptions = mapOptions(item?.dimensions || item?.variants, [
    "dimension",
  ]);

  const basePrice = item?.salesPrice ?? item?.price ?? 0;

  const initialValues = {
    color: colorOptions?.[0]?.label || "",
    colorPrice: colorOptions?.[0]?.price || 0,
    size: sizeOptions?.[0]?.label || "",
    sizePrice: sizeOptions?.[0]?.price || 0,
    weight: weightOptions?.[0]?.label || "",
    weightPrice: weightOptions?.[0]?.price || 0,
    dimension: dimensionOptions?.[0]?.label || "",
    dimensionPrice: dimensionOptions?.[0]?.price || 0,
    qty: 1,
  };

  const ProductSchema = Yup.object().shape({
    color: Yup.string().nullable(),
    size: Yup.string().nullable(),
    weight: Yup.string().nullable(),
    dimension: Yup.string().nullable(),
    qty: Yup.number().min(1).required(),
  });

  const computeTotal = (values: typeof initialValues) => {
    const modifiers = [
      values.colorPrice || 0,
      values.sizePrice || 0,
      values.weightPrice || 0,
      values.dimensionPrice || 0,
    ];
    return accumulateAmounts([basePrice, ...modifiers]) * (values.qty || 1);
  };

  if (isLoading || isFetching) {
    return <AppLoader />;
  }

  Logger.info("medias", item?.medias);
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

          <ProductGallery
            images={item?.medias?.[0]?.images}
            medias={item?.medias}
          />

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={ProductSchema}
            onSubmit={(values) => {
              const variant = {
                qty: values.qty,
                price: item?.price,
                salesPrice: item?.salesPrice,
                colors: values.color,
                colorsPrice: values.colorPrice,
                sizes: values.size,
                sizesPrice: values.sizePrice,
                weights: values.weight,
                weightsPrice: values.weightPrice,
                dimensions: values.dimension,
                dimensionsPrice: values.dimensionPrice,
              };
              const total = computeTotal(values);
              Logger.success("Product selection", { values, variant, total });
              addToCart(
                {
                  ...item,
                  variant,
                } as any,
                true
              );
            }}
          >
            {({ values, setFieldValue, handleSubmit }) => {
              const totalPrice = computeTotal(values);
              return (
                <View className="px-4 mt-5">
                  <Text className="text-2xl font-jost-medium">
                    {item?.name}
                  </Text>

                  <Text className="mt-1 text-sm leading-4 font-jost text-secondary">
                    {item?.description}
                  </Text>

                  {/* Variations */}
                  {colorOptions.length +
                    sizeOptions.length +
                    weightOptions.length +
                    dimensionOptions.length >
                    0 && (
                    <View className="gap-2 mt-5">
                      <Text className="text-sm text-primary font-jost-bold">
                        Variations
                      </Text>

                      {colorOptions.length > 0 && (
                        <View>
                          <Text className="mb-2 text-xs text-secondary">
                            Colors ({colorOptions.length})
                          </Text>
                          <View className="flex-row flex-wrap gap-3">
                            {colorOptions?.map((opt, idx) => {
                              const isActive = values.color === opt.label;
                              return (
                                <TouchableOpacity
                                  key={`${opt.label}-${idx}`}
                                  onPress={() => {
                                    setFieldValue("color", opt.label);
                                    setFieldValue("colorPrice", opt.price || 0);
                                  }}
                                  className={`w-8 h-8 rounded-full border ${
                                    isActive
                                      ? "border-black"
                                      : "border-gray-200"
                                  }`}
                                  style={{
                                    backgroundColor: opt.label.toLowerCase(),
                                  }}
                                />
                              );
                            })}
                          </View>
                        </View>
                      )}

                      {sizeOptions.length > 0 && (
                        <View>
                          <Text className="mb-2 text-xs text-secondary">
                            Sizes ({sizeOptions.length})
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {sizeOptions.map((opt, idx) => {
                              const isActive = values.size === opt.label;
                              return (
                                <TouchableOpacity
                                  key={`${opt.label}-${idx}`}
                                  onPress={() => {
                                    setFieldValue("size", opt.label);
                                    setFieldValue("sizePrice", opt.price || 0);
                                  }}
                                  className={`px-3 py-2 rounded-full border ${
                                    isActive
                                      ? "border-black bg-black"
                                      : "border-gray-200 bg-white"
                                  }`}
                                >
                                  <Text
                                    className={`text-xs font-jost-medium ${
                                      isActive ? "text-white" : "text-primary"
                                    }`}
                                  >
                                    {opt.label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      )}

                      {weightOptions.length > 0 && (
                        <View>
                          <Text className="mb-2 text-xs text-secondary">
                            Weights ({weightOptions.length})
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {weightOptions.map((opt, idx) => {
                              const isActive = values.weight === opt.label;
                              return (
                                <TouchableOpacity
                                  key={`${opt.label}-${idx}`}
                                  onPress={() => {
                                    setFieldValue("weight", opt.label);
                                    setFieldValue(
                                      "weightPrice",
                                      opt.price || 0
                                    );
                                  }}
                                  className={`px-3 py-2 rounded-full border ${
                                    isActive
                                      ? "border-black bg-black"
                                      : "border-gray-200 bg-white"
                                  }`}
                                >
                                  <Text
                                    className={`text-xs font-jost-medium ${
                                      isActive ? "text-white" : "text-primary"
                                    }`}
                                  >
                                    {opt.label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      )}

                      {dimensionOptions.length > 0 && (
                        <View>
                          <Text className="mb-2 text-xs text-secondary">
                            Dimensions ({dimensionOptions.length})
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {dimensionOptions.map((opt, idx) => {
                              const isActive = values.dimension === opt.label;
                              return (
                                <TouchableOpacity
                                  key={`${opt.label}-${idx}`}
                                  onPress={() => {
                                    setFieldValue("dimension", opt.label);
                                    setFieldValue(
                                      "dimensionPrice",
                                      opt.price || 0
                                    );
                                  }}
                                  className={`px-3 py-2 rounded-full border ${
                                    isActive
                                      ? "border-black bg-black"
                                      : "border-gray-200 bg-white"
                                  }`}
                                >
                                  <Text
                                    className={`text-xs font-jost-medium ${
                                      isActive ? "text-white" : "text-primary"
                                    }`}
                                  >
                                    {opt.label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Pricing & Quantity */}
                  <View className="mt-4">
                    <Text className="text-2xl font-jost-medium">
                      {formatCurrency(totalPrice)}
                    </Text>

                    <View className="flex-row items-center gap-3 mt-4">
                      <TouchableOpacity
                        disabled={values.qty <= 1}
                        className={classNames(
                          values.qty <= 1 && "border-[#aaa]",
                          "flex-row items-center p-1.5 border rounded-full"
                        )}
                        onPress={() =>
                          setFieldValue(
                            "qty",
                            Math.max(1, (values.qty || 1) - 1)
                          )
                        }
                      >
                        <Ionicons
                          name="remove"
                          size={24}
                          color={values.qty <= 1 ? "grey" : "black"}
                        />
                      </TouchableOpacity>
                      <Text className="text-base font-jost-medium">
                        {values.qty}
                      </Text>
                      <TouchableOpacity
                        className="p-2 bg-black rounded-full"
                        onPress={() =>
                          setFieldValue("qty", (values.qty || 1) + 1)
                        }
                      >
                        <Ionicons name="add" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* ACTION BUTTONS */}
                  <ProductDetailActions
                    product={item}
                    onAddToCart={handleSubmit}
                    onStartOrder={handleSubmit}
                  />
                </View>
              );
            }}
          </Formik>

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
