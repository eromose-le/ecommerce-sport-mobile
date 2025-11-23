type Variant = {
  id: string;
  productId: string;
  sizeId?: string | null;
  colorId?: string | null;
  typeId?: string | null;
  weight?: number | null;
  dimension?: string | null;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isDeleted: boolean;
  size?: { id: string; name: string } | null;
  color?: { id: string; name: string } | null;
};

export function buildVariantArray(
  variants: Variant[],
  key: "color" | "size" | "type" | "dimension" | "weight"
) {
  const idKey = `${key}Id` as keyof Variant;

  // No deduplication for weight and dimension, we want all objects with defined weight or dimension
  return variants
    ?.filter((v) => {
      if (key === "weight" || key === "dimension") {
        // If weight or dimension is the key, filter only those variants that have weight or dimension defined
        return v[key] != null;
      }
      return v[idKey]; // For other keys, we check if they exist
    })
    ?.map((v) => {
      // Building the return object based on the key
      const baseVariant = {
        [`${key}Id`]: v[idKey],
        price: v.price,
        stock: v.stock,
        deletedAt: v.deletedAt,
        isDeleted: v.isDeleted,
      };

      if (key === "color") {
        return {
          ...baseVariant,
          color: v.color, // Keep the nested color object {id, name}
        };
      }

      if (key === "size") {
        return {
          ...baseVariant,
          size: v.size, // Keep the nested size object {id, name}
        };
      }

      if (key === "weight") {
        return {
          ...baseVariant,
          weight: v.weight, // Include weight if present
        };
      }

      if (key === "dimension") {
        return {
          ...baseVariant,
          dimension: v.dimension, // Include dimension if present
        };
      }

      return baseVariant; // Return a base object for any unknown keys
    });
}
