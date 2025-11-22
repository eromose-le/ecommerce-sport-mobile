import AppLoader from "@/components/common/AppLoader";
import Modal from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "@/components/common/SecondaryButton";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FIVE_MINUTES, PAGINATION_DEFAULT } from "@/constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { CategoryService, ProductService } from "@/services/api";
import { Product } from "@/services/product/product.types";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../common/BackButton";

type SortValue = "asc" | "desc" | undefined;

type FilterState = {
  q: string;
  colors: string[];
  sizes: string[];
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortValue;
  createdAt?: string | null;
  page: number;
  limit: number;
};

const COLOR_FILTERS = [
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
  { label: "Grey", value: "grey" },
  { label: "Orange", value: "orange" },
  { label: "Cream", value: "cream" },
];

const SIZE_FILTERS = [
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "2XL", value: "2xl" },
];

const PRICE_PRESETS = [
  { label: "₦0 - ₦20k", range: [0, 20000] },
  { label: "₦20k - ₦50k", range: [20000, 50000] },
  { label: "₦50k - ₦100k", range: [50000, 100000] },
  { label: "Above ₦100k", range: [100000, 10000000] },
];

const SORT_OPTIONS: { label: string; value: SortValue }[] = [
  { label: "Price: Low to High", value: "asc" },
  { label: "Price: High to Low", value: "desc" },
];

// const PAGE_SIZE_OPTIONS = [6, 8, 12, 16, 20];

const defaultFilter: FilterState = {
  q: "",
  colors: [],
  sizes: [],
  page: PAGINATION_DEFAULT.page,
  limit: PAGINATION_DEFAULT.limit,
};

const AllProducts = () => {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.fetchCategories,
    staleTime: FIVE_MINUTES,
  });

  const selectedCategoryId = filter.category;
  const { data: categoryDetail, isLoading: categoryDetailLoading } = useQuery({
    queryKey: ["category", selectedCategoryId],
    queryFn: () =>
      CategoryService.fetchCategoryById(String(selectedCategoryId)),
    enabled: !!selectedCategoryId,
    staleTime: FIVE_MINUTES,
  });

  const categories =
    categoriesData?.data && Array.isArray(categoriesData.data)
      ? categoriesData.data
      : [];
  const subcategories =
    categoryDetail?.data?.subcategories &&
    Array.isArray(categoryDetail.data.subcategories)
      ? categoryDetail.data.subcategories
      : [];

  const debouncedSearch = useDebouncedValue(filter.q.trim(), 400);

  const queryParams = useMemo(
    () => ({
      page: filter.page,
      limit: filter.limit,
      q: debouncedSearch || undefined,
      category: filter.category || undefined,
      subcategory: filter.subcategory || undefined,
      color: filter.colors,
      size: filter.sizes,
      minPrice:
        typeof filter.minPrice === "number"
          ? String(filter.minPrice)
          : undefined,
      maxPrice:
        typeof filter.maxPrice === "number"
          ? String(filter.maxPrice)
          : undefined,
      sort: filter.sort,
      createdAt: filter.createdAt || undefined,
    }),
    [
      debouncedSearch,
      filter.category,
      filter.subcategory,
      filter.createdAt,
      filter.colors,
      filter.sizes,
      filter.limit,
      filter.maxPrice,
      filter.minPrice,
      filter.page,
      filter.sort,
    ]
  );

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", "all", queryParams],
    queryFn: ({ pageParam = 1 }) =>
      ProductService.fetchProducts({ ...queryParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage?.data?.currentPage ?? 1;
      const pageCount = lastPage?.data?.pageCount ?? 1;
      const next = current + 1;
      return next <= pageCount ? next : undefined;
    },
    retry: 1,
    staleTime: FIVE_MINUTES,
  });

  const products: Product[] = useMemo(
    () => data?.pages?.flatMap((page) => page?.data?.results || []) ?? [],
    [data]
  );

  const currentPage =
    data?.pages?.[data?.pages?.length - 1]?.data?.currentPage || 1;
  const totalPages =
    data?.pages?.[data?.pages?.length - 1]?.data?.pageCount || 1;
  const totalCount = data?.pages?.[0]?.data?.count || products.length;

  const updateFilter = (partial: Partial<FilterState>) => {
    setFilter((prev) => ({
      ...prev,
      ...partial,
      page: partial.page ?? 1,
    }));
  };

  const handleToggleCategory = (value?: string) => {
    updateFilter({
      category: filter.category === value ? undefined : value,
      subcategory: undefined,
    });
  };

  const handleToggleSubcategory = (value?: string) => {
    updateFilter({
      subcategory: filter.subcategory === value ? undefined : value,
    });
  };

  const toggleArrayValue = (key: "colors" | "sizes", value: string) => {
    setFilter((prev) => {
      const exists = prev[key].includes(value);
      const next = exists
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value];
      return { ...prev, [key]: next, page: 1 };
    });
  };

  const handlePresetPrice = (range: [number, number]) => {
    updateFilter({
      minPrice: range[0],
      maxPrice: range[1],
    });
  };

  const clearFilters = () => setFilter(defaultFilter);

  const activeBadges = [
    filter.category
      ? {
          label: filter.category,
          onClear: () => updateFilter({ category: undefined }),
        }
      : null,
    filter.subcategory
      ? {
          label: `Sub: ${filter.subcategory}`,
          onClear: () => updateFilter({ subcategory: undefined }),
        }
      : null,
    filter.colors.length
      ? {
          label: `Colors (${filter.colors.length})`,
          onClear: () => updateFilter({ colors: [] }),
        }
      : null,
    filter.sizes.length
      ? {
          label: `Sizes (${filter.sizes.length})`,
          onClear: () => updateFilter({ sizes: [] }),
        }
      : null,
    filter.minPrice !== undefined || filter.maxPrice !== undefined
      ? {
          label: `₦${(filter.minPrice ?? 0).toLocaleString()} - ₦${(filter.maxPrice ?? 0).toLocaleString()}`,
          onClear: () =>
            updateFilter({ minPrice: undefined, maxPrice: undefined }),
        }
      : null,
    filter.sort
      ? {
          label: filter.sort === "asc" ? "Low → High" : "High → Low",
          onClear: () => updateFilter({ sort: undefined }),
        }
      : null,
    filter.q
      ? {
          label: `Search: ${filter.q}`,
          onClear: () => updateFilter({ q: "" }),
        }
      : null,
  ].filter(Boolean) as { label: string; onClear: () => void }[];

  const FiltersHeader = (
    <View className="pt-3 pb-4 bg-background">
      <View className="flex-row items-center gap-2">
        <BackButton />
        {/* Search */}
        <View className="flex-1 flex-row items-center px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search products"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-primary font-jost"
            value={filter.q}
            onChangeText={(text) => updateFilter({ q: text })}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {filter.q.length > 0 && (
            <TouchableOpacity
              onPress={() => updateFilter({ q: "" })}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <View className="ml-auto">
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="flex-row items-center gap-2 px-4 py-4 border rounded-full border-[#E5E7EB] bg-white"
          >
            <Ionicons name="options" size={16} color="#111" />
            <Text className="text-sm font-jost-medium text-primary">
              Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Active filter badges */}
      {activeBadges.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {activeBadges.map((badge) => (
            <TouchableOpacity
              key={badge.label}
              onPress={badge.onClear}
              className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-[#F3F4F6]"
            >
              <Text className="text-xs font-jost-medium text-primary">
                {badge.label}
              </Text>
              <Ionicons name="close" size={12} color="#6B7280" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={clearFilters}
            className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-red-50"
          >
            <Ionicons name="refresh" size={12} color="#EF4444" />
            <Text className="text-xs text-red-500 font-jost-medium">Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-4">
        <Text className="text-sm text-secondary font-jost">
          Showing page {currentPage} of {totalPages}
        </Text>
        <Text className="text-sm text-secondary font-jost">
          {totalCount ? `${totalCount} items` : ""}
        </Text>
      </View>
    </View>
  );

  const filterModalContent = (
    <View className="gap-4">
      <Text className="text-2xl font-jost-semibold text-primary">
        Filter & Sort
      </Text>

      <View className="gap-2">
        <Text className="text-sm font-jost-medium text-primary">
          Price range pick
        </Text>

        <View className="flex-row flex-wrap">
          {PRICE_PRESETS.map((preset) => {
            const isActive =
              filter.minPrice === preset.range[0] &&
              filter.maxPrice === preset.range[1];
            return (
              <TouchableOpacity
                key={preset.label}
                onPress={() =>
                  handlePresetPrice(preset.range as [number, number])
                }
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-black border-black"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <Text
                  className={`text-sm font-jost-medium ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-jost-medium text-primary">
          Price range
        </Text>
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row gap-2 px-3 py-3 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
            <Text className="mb-1 text-xs text-secondary font-jost">Min</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="0"
              value={filter.minPrice ? String(filter.minPrice) : ""}
              onChangeText={(text) =>
                updateFilter({ minPrice: text ? Number(text) : undefined })
              }
              className="text-base font-jost text-primary"
            />
          </View>
          <Ionicons name="remove" size={16} color="#9CA3AF" />
          <View className="flex-1 flex-row gap-2 px-3 py-3 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
            <Text className="mb-1 text-xs text-secondary font-jost">Max</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="50000"
              value={filter.maxPrice ? String(filter.maxPrice) : ""}
              onChangeText={(text) =>
                updateFilter({ maxPrice: text ? Number(text) : undefined })
              }
              className="text-base font-jost text-primary"
            />
          </View>
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-jost-medium text-primary">Category</Text>
        <View className="flex-row flex-wrap gap-2">
          <TouchableOpacity
            onPress={() => handleToggleCategory(undefined)}
            className={`px-4 py-2 rounded-full border ${
              !filter.category
                ? "bg-black border-black"
                : "bg-white border-[#E5E7EB]"
            }`}
          >
            <Text
              className={`text-sm font-jost-medium ${
                !filter.category ? "text-white" : "text-primary"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>

          {categoriesLoading && (
            <Text className="text-xs text-secondary font-jost">
              Loading categories...
            </Text>
          )}

          {categories.map((item) => {
            const isActive = filter.category === item.id;
            return (
              <TouchableOpacity
                key={`modal-cat-${item.id}`}
                onPress={() => handleToggleCategory(item.id)}
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-black border-black"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <Text
                  className={`text-xs font-jost-medium ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {filter.category ? (
        <View className="gap-2">
          <Text className="text-sm font-jost-medium text-primary">
            Subcategory
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity
              onPress={() => handleToggleSubcategory(undefined)}
              className={`px-4 py-2 rounded-full border ${
                !filter.subcategory
                  ? "bg-[#111827] border-[#111827]"
                  : "bg-white border-[#E5E7EB]"
              }`}
            >
              <Text
                className={`text-sm font-jost-medium ${
                  !filter.subcategory ? "text-white" : "text-primary"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>

            {categoryDetailLoading && (
              <Text className="text-xs text-secondary font-jost">
                Loading subcategories...
              </Text>
            )}

            {subcategories.map((item) => {
              const isActive = filter.subcategory === item.id;
              return (
                <TouchableOpacity
                  key={`modal-sub-${item.id}`}
                  onPress={() => handleToggleSubcategory(item.id)}
                  className={`px-4 py-2 rounded-full border ${
                    isActive
                      ? "bg-[#111827] border-[#111827]"
                      : "bg-white border-[#E5E7EB]"
                  }`}
                >
                  <Text
                    className={`text-xs font-jost-medium ${
                      isActive ? "text-white" : "text-primary"
                    }`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      <View className="gap-2">
        <Text className="text-sm font-jost-medium text-primary">Sort</Text>
        <View className="flex-row flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => {
            const isActive = filter.sort === option.value;
            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => updateFilter({ sort: option.value })}
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-black border-black"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <Text
                  className={`text-sm font-jost-medium ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Color */}
      <View className="gap-2">
        <Text className="text-sm font-jost-medium text-primary">Color</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
          {COLOR_FILTERS.map((item) => {
            const isActive = filter.colors.includes(item.value);
            return (
              <TouchableOpacity
                key={`color-${item.value}`}
                onPress={() => toggleArrayValue("colors", item.value)}
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-black border-black"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <Text
                  className={`text-sm font-jost-medium ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Size */}
      <View className="">
        <Text className="gap-2 text-sm font-jost-medium text-primary">
          Size
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
          {SIZE_FILTERS.map((item) => {
            const isActive = filter.sizes.includes(item.value);
            return (
              <TouchableOpacity
                key={`size-${item.value}`}
                onPress={() => toggleArrayValue("sizes", item.value)}
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-black border-black"
                    : "bg-white border-[#E5E7EB]"
                }`}
              >
                <Text
                  className={`text-sm font-jost-medium ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View className="flex-row gap-3 mt-2">
        <SecondaryButton
          title="Close"
          onPress={() => setShowFilters(false)}
          className="flex-1"
        />
        <PrimaryButton
          title="Apply"
          onPress={() => setShowFilters(false)}
          className="flex-1"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      {/* <AppHeader title="All products" right={<View className="w-8" />} /> */}

      {!isLoading && (!products || products.length === 0) && (
        <View className="px-5">{FiltersHeader}</View>
      )}

      <ProductGrid
        data={products}
        loading={isLoading}
        loadingMore={isFetchingNextPage}
        error={error}
        onRetry={refetch}
        scrollEnabled
        numColumns={2}
        gap={12}
        ListHeaderComponent={FiltersHeader}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 24,
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />

      <Modal
        visible={showFilters}
        variant="bottom"
        onClose={() => setShowFilters(false)}
        occupyFullBottom
        // contentHeight="80%"
      >
        <SafeAreaView className="">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          >
            {filterModalContent}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {isLoading && (
        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <AppLoader />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AllProducts;
