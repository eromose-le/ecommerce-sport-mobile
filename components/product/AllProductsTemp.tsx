import AppLoader from "@/components/common/AppLoader";
import { BackButton } from "@/components/common/BackButton";
import Modal from "@/components/common/Modal";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PrimaryButton, SecondaryButton } from "@/components/ui";
import { FIVE_MINUTES, PAGINATION_DEFAULT } from "@/constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { CategoryService, ProductService } from "@/services/api";
import { Logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const PAGE_SIZE_OPTIONS = [6, 8, 12, 16, 20];

const defaultFilter: FilterState = {
  q: "",
  colors: [],
  sizes: [],
  page: PAGINATION_DEFAULT.page,
  limit: 12,
};

const AllProducts = () => {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.fetchCategories,
    staleTime: FIVE_MINUTES,
  });

  Logger.warn("categoriesData", categoriesData);

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

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["products", "all", queryParams],
    queryFn: () => ProductService.fetchProducts(queryParams),
    // keepPreviousData: true,
    retry: 1,
    staleTime: FIVE_MINUTES,
  });

  const products = data?.data?.results || [];
  const currentPage = data?.data?.currentPage || filter.page;
  const totalPages = data?.data?.pageCount || 1;
  const totalCount = data?.data?.count || products.length;

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

  const handleChangePage = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setFilter((prev) => ({ ...prev, page: prev.page - 1 }));
    }
    if (direction === "next" && currentPage < totalPages) {
      setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
    }
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
    <View className="pt-3 pb-4">
      {/* Search */}
      <View className="flex-row items-center px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl">
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
          <TouchableOpacity onPress={() => updateFilter({ q: "" })} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick filters */}
      <View className="mt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
          {/* Categories */}
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
              All categories
            </Text>
          </TouchableOpacity>

          {categories.map((item) => {
            const isActive = filter.category === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleToggleCategory(item.id)}
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
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Subcategories (only show when a category is selected) */}
          {filter.category ? (
            <>
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
                  All subcategories
                </Text>
              </TouchableOpacity>

              {(categoryDetailLoading && (
                <Text className="text-xs text-secondary font-jost">
                  Loading subcategories...
                </Text>
              )) ||
                null}

              {subcategories.map((item) => {
                const isActive = filter.subcategory === item.id;
                return (
                  <TouchableOpacity
                    key={`sub-${item.id}`}
                    onPress={() => handleToggleSubcategory(item.id)}
                    className={`px-4 py-2 rounded-full border ${
                      isActive
                        ? "bg-[#111827] border-[#111827]"
                        : "bg-white border-[#E5E7EB]"
                    }`}
                  >
                    <Text
                      className={`text-sm font-jost-medium ${
                        isActive ? "text-white" : "text-primary"
                      }`}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : null}

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

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="flex-row items-center gap-2 px-4 py-2 border rounded-full border-[#E5E7EB] bg-white"
          >
            <Ionicons name="options" size={16} color="#111" />
            <Text className="text-sm font-jost-medium text-primary">
              Filters
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Category list with subcategories */}
      <View className="mt-3">
        <Text className="mb-2 text-sm font-jost-medium text-primary">
          Category & Subcategory
        </Text>

        {categoriesLoading ? (
          <Text className="text-xs text-secondary font-jost">
            Loading categories...
          </Text>
        ) : (
          <View className="border border-[#E5E7EB] rounded-2xl bg-white">
            {categories.map((item) => {
              const isActive = filter.category === item.id;
              return (
                <View
                  key={`list-cat-${item.id}`}
                  className="border-b border-[#F3F4F6] last:border-b-0"
                >
                  <TouchableOpacity
                    onPress={() => handleToggleCategory(item.id)}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      isActive ? "bg-[#F9FAFB]" : ""
                    }`}
                  >
                    <Text
                      className={`text-sm font-jost-medium ${
                        isActive ? "text-primary" : "text-secondary"
                      }`}
                    >
                      {item.name}
                    </Text>
                    {isActive ? (
                      <Ionicons name="chevron-down" size={16} color="#111" />
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#9CA3AF"
                      />
                    )}
                  </TouchableOpacity>

                  {isActive ? (
                    <View className="px-4 pb-3">
                      {categoryDetailLoading ? (
                        <Text className="text-xs text-secondary font-jost">
                          Loading subcategories...
                        </Text>
                      ) : subcategories.length === 0 ? (
                        <Text className="text-xs text-secondary font-jost">
                          No subcategories found
                        </Text>
                      ) : (
                        <View className="flex-row flex-wrap gap-2 mt-2">
                          <TouchableOpacity
                            onPress={() => handleToggleSubcategory(undefined)}
                            className={`px-3 py-2 rounded-full border ${
                              !filter.subcategory
                                ? "bg-[#111827] border-[#111827]"
                                : "bg-white border-[#E5E7EB]"
                            }`}
                          >
                            <Text
                              className={`text-xs font-jost-medium ${
                                !filter.subcategory
                                  ? "text-white"
                                  : "text-primary"
                              }`}
                            >
                              All
                            </Text>
                          </TouchableOpacity>

                          {subcategories.map((sub) => {
                            const subActive = filter.subcategory === sub.id;
                            return (
                              <TouchableOpacity
                                key={`list-sub-${sub.id}`}
                                onPress={() => handleToggleSubcategory(sub.id)}
                                className={`px-3 py-2 rounded-full border ${
                                  subActive
                                    ? "bg-[#111827] border-[#111827]"
                                    : "bg-white border-[#E5E7EB]"
                                }`}
                              >
                                <Text
                                  className={`text-xs font-jost-medium ${
                                    subActive ? "text-white" : "text-primary"
                                  }`}
                                >
                                  {sub.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Color & size chips */}
      <View className="mt-2">
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
      <Text className="text-lg font-jost-semibold text-primary">
        Filter & Sort
      </Text>

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
        <Text className="text-sm font-jost-medium text-primary">Colors</Text>
        <View className="flex-row flex-wrap gap-2">
          {COLOR_FILTERS.map((item) => {
            const isActive = filter.colors.includes(item.value);
            return (
              <TouchableOpacity
                key={`modal-color-${item.value}`}
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
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-jost-medium text-primary">Sizes</Text>
        <View className="flex-row flex-wrap gap-2">
          {SIZE_FILTERS.map((item) => {
            const isActive = filter.sizes.includes(item.value);
            return (
              <TouchableOpacity
                key={`modal-size-${item.value}`}
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
        </View>
      </View>

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

      <View className="gap-2">
        <Text className="text-sm font-jost-medium text-primary">
          Items per page
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {PAGE_SIZE_OPTIONS.map((size) => {
            const isActive = filter.limit === size;
            return (
              <TouchableOpacity
                key={size}
                onPress={() => updateFilter({ limit: size })}
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
                  {size}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
      <View className="flex-row items-center gap-3 px-4 pt-2 pb-3">
        <BackButton />
        <Text className="text-lg font-jost-semibold text-primary">
          All products
        </Text>
      </View>

      <ProductGrid
        data={products}
        loading={isLoading || isRefetching}
        loadingMore={false}
        error={error}
        onRetry={refetch}
        scrollEnabled
        numColumns={2}
        gap={12}
        ListHeaderComponent={FiltersHeader}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 110,
        }}
      />

      {/* Pagination footer */}
      <View className="absolute left-0 right-0 bottom-0 px-5 py-4 bg-white border-t border-[#E5E7EB]">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => handleChangePage("prev")}
            disabled={currentPage <= 1}
            className={`px-4 py-3 rounded-2xl border ${
              currentPage <= 1 ? "border-[#E5E7EB]" : "border-black"
            }`}
          >
            <Text
              className={`text-sm font-jost-semibold ${
                currentPage <= 1 ? "text-secondary" : "text-primary"
              }`}
            >
              Prev
            </Text>
          </TouchableOpacity>

          <View className="items-center">
            <Text className="mb-1 text-xs text-secondary font-jost">
              Page {currentPage} of {totalPages}
            </Text>
            <Text className="text-sm font-jost text-secondary">
              {totalCount ? `${totalCount} items` : ""}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleChangePage("next")}
            disabled={currentPage >= totalPages}
            className={`px-4 py-3 rounded-2xl border ${
              currentPage >= totalPages ? "border-[#E5E7EB]" : "border-black"
            }`}
          >
            <Text
              className={`text-sm font-jost-semibold ${
                currentPage >= totalPages ? "text-secondary" : "text-primary"
              }`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        occupyFullBottom
      >
        {filterModalContent}
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
