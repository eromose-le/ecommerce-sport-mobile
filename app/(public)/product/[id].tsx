import { useLocalSearchParams } from "expo-router";
import { Logger } from "@/utils/logger";
import ProductDetail from "@/components/product/ProductDetail";

export default function ProductDetailPublic() {
  const { product } = useLocalSearchParams() as any;
  const item = JSON.parse(product);

  Logger.warn("product", item);

  return <ProductDetail />;
}
