import { CartItem } from "@/services/cart/cart.types";
import { getEffectivePrice } from "./product-discount";
import { accumulateAmounts } from "./accumulate-amounts";

export const showCartQtyValue = (cart: CartItem[]) => {
  const value = cart?.length || 0;
  return {
    status: value > 0,
    value,
  };
};

export const showTotalPriceInCartOld = (cart: CartItem[]) => {
  const totalPrice = cart.reduce((accumulator: number, currentItem: any) => {
    const qty = currentItem?.qty ?? currentItem?.variant?.qty ?? 1;
    const price =
      currentItem?.price ??
      currentItem?.variant?.salesPrice ??
      currentItem?.variant?.price ??
      0;
    return accumulator + price * qty;
  }, 0);

  return totalPrice;
};

const getBaseVariantPrice = (item: CartItem) =>
  getEffectivePrice(
    item?.variant?.price ?? item?.price,
    item?.variant?.salesPrice ?? item?.salesPrice
  );

export const showSinglePriceInCart = (cart: CartItem) => {
  const price = getBaseVariantPrice(cart);
  const modifiers = accumulateAmounts([
    price || 0,
    cart?.variant?.colorsPrice || 0,
    cart?.variant?.dimensionsPrice || 0,
    cart?.variant?.sizesPrice || 0,
    cart?.variant?.weightsPrice || 0,
  ]);

  const qty = Math.max(1, cart?.variant?.qty || 0);
  return modifiers * qty;
};

export const showTotalPriceInCart = (cart: CartItem[]) => {
  const totalPrice = cart.reduce((accumulator: number, currentItem) => {
    return accumulator + showSinglePriceInCart(currentItem);
  }, 0);

  return totalPrice;
};

export const shippingFeeCalulation = (total: number, percentage: number) => {
  const result = (total / 100) * percentage;
  return result;
};

export const showShippingFeePrice = (
  showTotalPriceInCart: number,
  shippingFee: number
) => {
  const total = Number(showTotalPriceInCart || 0);
  const shippingFeeResult = shippingFeeCalulation(total, shippingFee);
  return Number(shippingFeeResult || 0);
};

export const showTotalPrice = (
  showTotalPriceInCart: number,
  shippingFee: number
) => {
  return Number(showTotalPriceInCart || 0) + Number(shippingFee || 0);
};
