import { mergeArrays } from "./remove-id-and-merge-array";

export const cleanAndGroupVariants = (variants: Array<any>) => {
  // Arrays to store the cleaned variant types
  const variantsColor: Array<any> = [];
  const variantsSize: Array<any> = [];
  const variantsWeight: Array<any> = [];
  const variantsDimension: Array<any> = [];

  // Iterate over the provided array
  variants.forEach((variant) => {
    // Clean the variant object by removing the 'id' property
    const { ...cleanedVariant } = variant;

    // Group variants based on their properties
    if (cleanedVariant.colorId) {
      variantsColor.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        colorId: cleanedVariant.colorId,
      });
    } else if (cleanedVariant.sizeId) {
      variantsSize.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        sizeId: cleanedVariant.sizeId,
      });
    } else if (cleanedVariant.weight) {
      variantsWeight.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        weight: cleanedVariant.weight,
      });
    } else if (cleanedVariant.dimension) {
      variantsDimension.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        dimension: cleanedVariant.dimension,
      });
    }
  });

  // const result = mergeArrays();

  return {
    variantsColor,
    variantsSize,
    variantsWeight,
    variantsDimension,
  };
};

export const cleanAndGroupVariantsV2 = (variants: Array<any>) => {
  // Arrays to store the cleaned variant types
  const variantsColor: Array<any> = [];
  const variantsSize: Array<any> = [];
  const variantsWeight: Array<any> = [];
  const variantsDimension: Array<any> = [];

  // Iterate over the provided array
  variants?.forEach((variant) => {
    // Clean the variant object by removing the 'id' property
    const { ...cleanedVariant } = variant;

    // Group variants based on their properties
    if (cleanedVariant.colorId) {
      variantsColor.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        colorId: cleanedVariant.colorId,
        color: cleanedVariant.color.name,
      });
    } else if (cleanedVariant.sizeId) {
      variantsSize.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        sizeId: cleanedVariant.sizeId,
        size: cleanedVariant.size.name,
      });
    } else if (cleanedVariant.weight) {
      variantsWeight.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        weight: cleanedVariant.weight,
      });
    } else if (cleanedVariant.dimension) {
      variantsDimension.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        dimension: cleanedVariant.dimension,
      });
    }
  });

  const result = mergeArrays(
    variantsColor,
    variantsSize,
    variantsWeight,
    variantsDimension
  );

  return result;
};

export const convertPriceAndStockToNumber = (data: Array<any>) => {
  return data.map((item) => ({
    ...item,
    price: typeof item.price === "string" ? Number(item.price) : item.price,
    stock: typeof item.stock === "string" ? Number(item.stock) : item.stock,
  }));
};

// Example Usage
const initialVariants = [
  {
    id: "a5a15bc6-fc70-47d6-a5a6-70116f475855",
    productId: "3861bb5c-69b6-400f-b6cb-57fd813fc413",
    sizeId: null,
    colorId: "9934e59d-6a92-4dd4-b00e-a49b719bc2c1",
    weight: null,
    dimension: null,
    price: 10,
    stock: 1000,
  },
  {
    id: "8b32c271-e4bc-4076-a870-7733e369055a",
    productId: "3861bb5c-69b6-400f-b6cb-57fd813fc413",
    sizeId: null,
    colorId: "c587c285-193d-4e09-94d9-b3c3c9444213",
    weight: null,
    dimension: null,
    price: 20,
    stock: 2000,
  },
  {
    id: "dddecfcf-cf80-462a-9ae5-d5be0f12d02a",
    productId: "3861bb5c-69b6-400f-b6cb-57fd813fc413",
    sizeId: "33aae9f2-a25e-4be2-9781-6410bfee2c33",
    colorId: null,
    weight: null,
    dimension: null,
    price: 10,
    stock: 150,
  },
  {
    id: "99050d6a-a31d-4bfc-8028-7783cef4ff20",
    productId: "3861bb5c-69b6-400f-b6cb-57fd813fc413",
    sizeId: null,
    colorId: null,
    weight: null,
    dimension: "2x2",
    price: 10,
    stock: 1000,
  },
  // Additional variants...
];

const cleanedVariants = cleanAndGroupVariants(initialVariants);
console.log(cleanedVariants);
