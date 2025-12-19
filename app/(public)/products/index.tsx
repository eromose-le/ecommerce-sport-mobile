import AllProducts from "@/components/product/AllProducts";
import { useLocalSearchParams } from "expo-router";

export default function PublicAllProducts() {
  const params = useLocalSearchParams<{
    category?: string;
    subcategory?: string;
    q?: string;
  }>();
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const subcategory =
    typeof params.subcategory === "string" ? params.subcategory : undefined;
  const query = typeof params.q === "string" ? params.q : undefined;

  return (
    <AllProducts
      initialCategoryId={category}
      initialSubcategoryId={subcategory}
      initialQuery={query}
    />
  );
}
