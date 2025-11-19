import ProductDetail from "@/components/product/ProductDetail";
import { Logger } from "@/utils/logger";
import { useLocalSearchParams } from "expo-router";

export default function ProductDetailPublic() {
  const { product } = useLocalSearchParams<{
    id?: string;
    product?: any[];
  }>() as any;
  const item = JSON.parse(product);

  Logger.warn("product", item);

  return <ProductDetail />;
}
