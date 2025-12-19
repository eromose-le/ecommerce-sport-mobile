import AppLoader from "@/components/common/AppLoader";
import Modal from "@/components/common/Modal";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  BodyText,
  Heading,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import { FIVE_MINUTES, PAGINATION_DEFAULT } from "@/constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { CategoryService, ProductService } from "@/services/api";
import { Product } from "@/services/product/product.types";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../common/BackButton";
import TextField from "../common/TextField";
import SafeContainer from "../ui/layout/safe-container";

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

type AllProductsProps = {
  initialCategoryId?: string;
  initialSubcategoryId?: string;
  initialQuery?: string;
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

const buildInitialFilter = ({
  initialCategoryId,
  initialSubcategoryId,
  initialQuery,
}: AllProductsProps): FilterState => ({
  ...defaultFilter,
  ...(initialQuery ? { q: initialQuery } : {}),
  ...(initialCategoryId ? { category: initialCategoryId } : {}),
  ...(initialSubcategoryId ? { subcategory: initialSubcategoryId } : {}),
});

const AllProducts = ({
  initialCategoryId,
  initialSubcategoryId,
  initialQuery,
}: AllProductsProps) => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<FilterState>(() =>
    buildInitialFilter({ initialCategoryId, initialSubcategoryId, initialQuery })
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const next = buildInitialFilter({
      initialCategoryId,
      initialSubcategoryId,
      initialQuery,
    });
    setFilter((prev) => {
      const hasChanged =
        prev.category !== next.category ||
        prev.subcategory !== next.subcategory ||
        prev.q !== next.q;
      return hasChanged ? next : prev;
    });
  }, [initialCategoryId, initialQuery, initialSubcategoryId]);

  const getPillClass = (isActive: boolean) =>
    classNames(
      "px-4 py-2 rounded-full border",
      isActive
        ? isDark
          ? "bg-white border-white"
          : "bg-black border-black"
        : isDark
          ? "bg-transparent border-gray-600"
          : "bg-white border-[#E5E7EB]"
    );

  const getPillTextTone = (isActive: boolean) =>
    isActive ? (isDark ? "primary" : "inverse") : theme.bodyTone;

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

  const activeCategoryLabel = filter.category
    ? categories.find((item) => item.id === filter.category)?.name ||
      filter.category
    : undefined;
  const activeSubcategoryLabel = filter.subcategory
    ? subcategories.find((item) => item.id === filter.subcategory)?.name ||
      filter.subcategory
    : undefined;

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
          label: activeCategoryLabel ?? filter.category,
          onClear: () => updateFilter({ category: undefined }),
        }
      : null,
    filter.subcategory
      ? {
          label: `Sub: ${activeSubcategoryLabel ?? filter.subcategory}`,
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
    <View className={`${theme.pageBg} pt-3 pb-4`}>
      <View className="flex-row items-center w-full gap-2">
        <BackButton />
        {/* Search */}
        <View
          className={classNames(
            "flex-1 flex-row items-center px-4 py-3 rounded-2xl border",
            theme.surface
          )}
        >
          <Ionicons name="search-outline" size={18} color={theme.iconMuted} />
          <TextInput
            placeholder="Search products"
            placeholderTextColor={theme.placeholderColor}
            className={classNames(
              "flex-1 ml-3 text-base font-jost",
              isDark ? "text-white" : "text-primary"
            )}
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
              <Ionicons name="close-circle" size={18} color={theme.iconMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <View className="ml-auto">
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={classNames(
              "flex-row items-center gap-2 px-4 py-4 rounded-full border",
              theme.surface
            )}
          >
            <Ionicons
              name="options"
              size={16}
              color={isDark ? "#e5e7eb" : "#111"}
            />
            <BodyText size="sm" weight="medium" tone={theme.headingTone}>
              Filters
            </BodyText>
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
              className={classNames(
                "flex-row items-center gap-1 px-3 py-1 rounded-full border",
                isDark
                  ? "bg-[#1f2937] border-[#374151]"
                  : "bg-[#F3F4F6] border-[#E5E7EB]"
              )}
            >
              <BodyText size="xs" weight="medium" tone={theme.bodyTone}>
                {badge.label}
              </BodyText>
              <Ionicons name="close" size={12} color={theme.iconMuted} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={clearFilters}
            className={classNames(
              "flex-row items-center justify-center gap-1 px-3 py-1 rounded-full",
              isDark ? "bg-[#3f1a1a]" : "bg-red-50"
            )}
          >
            <Ionicons
              name="refresh"
              size={12}
              color={isDark ? "#fca5a5" : "#EF4444"}
            />
            <BodyText size="xs" weight="medium" tone="danger">
              Clear
            </BodyText>
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-4">
        <BodyText size="sm" tone={theme.labelTone}>
          Showing page {currentPage} of {totalPages}
        </BodyText>
        <BodyText size="sm" tone={theme.labelTone}>
          {totalCount ? `${totalCount} items` : ""}
        </BodyText>
      </View>
    </View>
  );

  const filterModalContent = (
    <SafeContainer className={`${theme.mutedSurface} gap-4`}>
      <Heading level="h2" weight="bold" tone={theme.headingTone}>
        Filter & Sort
      </Heading>

      <View className="gap-2">
        <BodyText size="sm" weight="semibold" tone={theme.headingTone}>
          Pick price range
        </BodyText>

        <View className="flex-row flex-wrap gap-2">
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
                className={getPillClass(isActive)}
              >
                <BodyText
                  size="sm"
                  weight="medium"
                  tone={getPillTextTone(isActive)}
                >
                  {preset.label}
                </BodyText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="gap-2">
        <BodyText size="sm" weight="semibold" tone={theme.headingTone}>
          Price range
        </BodyText>
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <TextField
              label="Minimum"
              keyboardType="numeric"
              placeholder="₦0"
              autoCapitalize="none"
              value={filter.minPrice ? String(filter.minPrice) : ""}
              onChangeText={(text) =>
                updateFilter({ minPrice: text ? Number(text) : undefined })
              }
            />
          </View>

          <Ionicons name="remove" size={16} color={theme.iconMuted} />

          <View className="flex-1">
            <TextField
              label="Maximum"
              keyboardType="numeric"
              placeholder="₦50000"
              autoCapitalize="none"
              value={filter.maxPrice ? String(filter.maxPrice) : ""}
              onChangeText={(text) =>
                updateFilter({ maxPrice: text ? Number(text) : undefined })
              }
            />
          </View>
        </View>
      </View>

      <View className="gap-2">
        <BodyText size="sm" weight="semibold" tone={theme.headingTone}>
          Category
        </BodyText>
        <View className="flex-row flex-wrap gap-2">
          <TouchableOpacity
            onPress={() => handleToggleCategory(undefined)}
            className={getPillClass(!filter.category)}
          >
            <BodyText
              size="sm"
              weight="medium"
              tone={getPillTextTone(!filter.category)}
            >
              All
            </BodyText>
          </TouchableOpacity>

          {categoriesLoading && (
            <BodyText size="xs" tone={theme.labelTone}>
              Loading categories...
            </BodyText>
          )}

          {categories.map((item) => {
            const isActive = filter.category === item.id;
            return (
              <TouchableOpacity
                key={`modal-cat-${item.id}`}
                onPress={() => handleToggleCategory(item.id)}
                className={getPillClass(isActive)}
              >
                <BodyText
                  size="xs"
                  weight="medium"
                  tone={getPillTextTone(isActive)}
                >
                  {item.name}
                </BodyText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {filter.category ? (
        <View className="gap-2">
          <BodyText size="sm" weight="semibold" tone={theme.headingTone}>
            Subcategory
          </BodyText>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity
              onPress={() => handleToggleSubcategory(undefined)}
              className={getPillClass(!filter.subcategory)}
            >
              <BodyText
                size="sm"
                weight="medium"
                tone={getPillTextTone(!filter.subcategory)}
              >
                All
              </BodyText>
            </TouchableOpacity>

            {categoryDetailLoading && (
              <BodyText size="xs" tone={theme.labelTone}>
                Loading subcategories...
              </BodyText>
            )}

            {subcategories.map((item) => {
              const isActive = filter.subcategory === item.id;
              return (
                <TouchableOpacity
                  key={`modal-sub-${item.id}`}
                  onPress={() => handleToggleSubcategory(item.id)}
                  className={getPillClass(isActive)}
                >
                  <BodyText
                    size="xs"
                    weight="medium"
                    tone={getPillTextTone(isActive)}
                  >
                    {item.name}
                  </BodyText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      <View className="gap-2">
        <BodyText size="sm" weight="semibold" tone={theme.headingTone}>
          Sort
        </BodyText>
        <View className="flex-row flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => {
            const isActive = filter.sort === option.value;
            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => updateFilter({ sort: option.value })}
                className={getPillClass(isActive)}
              >
                <BodyText
                  size="sm"
                  weight="medium"
                  tone={getPillTextTone(isActive)}
                >
                  {option.label}
                </BodyText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Color */}
      <View className="gap-2">
        <BodyText size="sm" weight="semibold" tone={theme.headingTone}>
          Color
        </BodyText>
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
                className={getPillClass(isActive)}
              >
                <BodyText
                  size="sm"
                  weight="medium"
                  tone={getPillTextTone(isActive)}
                >
                  {item.label}
                </BodyText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Size */}
      <View className="">
        <BodyText size="sm" weight="semibold" tone={theme.headingTone}>
          Size
        </BodyText>
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
                className={getPillClass(isActive)}
              >
                <BodyText
                  size="sm"
                  weight="medium"
                  tone={getPillTextTone(isActive)}
                >
                  {item.label}
                </BodyText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View className="flex-row gap-3 mt-2">
        <SecondaryButton
          title="Close"
          onPress={() => setShowFilters(false)}
          className={`${theme.pageBgInverse} flex-1 border border-black`}
          textClassName={`${theme.secondaryTextClass}`}
          spinnerColor={theme.secondarySpinnerColor}
        />
        <PrimaryButton
          title="Apply"
          onPress={() => setShowFilters(false)}
          className={`${theme.pageBg} flex-1`}
          textClassName={theme.primaryTextClass}
          spinnerColor={theme.primarySpinnerColor}
        />
      </View>
    </SafeContainer>
  );

  return (
    <SafeContainer
      edges={["top"]}
      padding="none"
      gap="md"
      className={`${theme.pageBg} flex-1`}
    >
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
            contentContainerStyle={{ gap: 8, paddingVertical: 10 }}
          >
            {filterModalContent}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {isLoading && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <AppLoader />
        </View>
      )}
    </SafeContainer>
  );
};

export default AllProducts;
