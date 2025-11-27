import { PRODUCT_DETAIL } from "@/constants/urls";
import { showSinglePriceInCart } from "@/helpers/cart";
import { CartItem } from "@/services/cart/cart.types";
import { formatCurrency } from "@/utils/currency";
import { resolveImageSource } from "@/utils/images";
import { Ionicons } from "@expo/vector-icons";
import classNames from "classnames";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CartCardProps = {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

const CartCard: React.FC<CartCardProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const qty = Math.max(1, item?.variant?.qty || 1);
  const lineTotal = showSinglePriceInCart(item);
  const imageSource = resolveImageSource(
    item?.displayImage || item?.product?.displayImage
  );

  const isDisableIncreament = qty <= 1;

  // === Swipe-to-remove (left or right) ===
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwiping = useRef(false);
  const [cardWidth, setCardWidth] = useState(0);

  // Use percentages of width so behavior is consistent on all devices
  const SWIPE_MAX_TRANSLATE = cardWidth ? cardWidth * 0.7 : 180; // max drag distance
  const SWIPE_REMOVE_THRESHOLD = cardWidth ? cardWidth * 0.3 : 80; // trigger delete

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
        Math.abs(gesture.dx) > 10,

      onPanResponderGrant: () => {
        isSwiping.current = false;
      },

      onPanResponderMove: (_, gesture) => {
        // clamp between -SWIPE_MAX_TRANSLATE and +SWIPE_MAX_TRANSLATE
        const max = SWIPE_MAX_TRANSLATE;
        const clamped = Math.max(-max, Math.min(gesture.dx, max));
        translateX.setValue(clamped);

        if (Math.abs(gesture.dx) > 10) {
          isSwiping.current = true;
        }
      },

      onPanResponderRelease: (_, gesture) => {
        const { dx } = gesture;
        const absDx = Math.abs(dx);

        if (absDx > SWIPE_REMOVE_THRESHOLD) {
          // Swipe far enough -> remove (left OR right)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          Animated.timing(translateX, {
            toValue: dx > 0 ? cardWidth || 300 : -(cardWidth || 300),
            duration: 180,
            useNativeDriver: true,
          }).start(() => onRemove());
        } else {
          // Not far enough -> snap back
          if (absDx > 4) {
            Haptics.selectionAsync();
          }

          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }

        isSwiping.current = false;
      },

      onPanResponderTerminate: () => {
        // Gesture cancelled (e.g. parent scrollview takes over)
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        isSwiping.current = false;
      },
    })
  ).current;

  const handleNavigate = () => {
    // avoid triggering navigation when it was actually a swipe
    if (isSwiping.current) return;

    const product = item?.product || item;
    const productId = product?.id || item?.id;
    if (!productId) return;

    router.push({
      pathname: PRODUCT_DETAIL,
      params: { id: String(productId), product: JSON.stringify(product) },
    });
  };

  return (
    <View className="flex-1 mb-1 overflow-hidden">
      {/* Right side background */}
      <View className="absolute inset-y-0 right-0 items-center justify-center px-4 bg-red-50 rounded-2xl">
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </View>

      {/* Left side background */}
      <View className="absolute inset-y-0 left-0 items-center justify-center px-4 bg-red-50 rounded-2xl">
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </View>

      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
        className="flex-row items-center gap-4 p-4 bg-white rounded"
        onLayout={(e) => {
          setCardWidth(e.nativeEvent.layout.width);
        }}
      >
        {/* Product Image */}
        <TouchableOpacity onPress={handleNavigate} activeOpacity={0.8}>
          <Image
            source={imageSource}
            className="w-36 h-36 rounded-xl bg-[#E8EAEC]"
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Details */}
        <TouchableOpacity
          // onPress={handleNavigate}
          activeOpacity={0.8}
          className="flex-1 ml-4"
        >
          <Text className="text-lg font-jost-medium" numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            numberOfLines={2}
            className="mt-1 text-sm text-secondary font-jost"
          >
            {item.description || "No description added"}
          </Text>

          <Text className="mt-2 text-base font-bold">
            {formatCurrency(lineTotal)}
          </Text>

          <View className="flex-row items-center justify-between mt-2">
            {/* Quantity Controls */}
            <View className="flex-row items-center ">
              <TouchableOpacity
                className={classNames(
                  isDisableIncreament
                    ? "border-gray-300 bg-[#eee]"
                    : "bg-black",
                  "px-3 py-2 border border-black rounded"
                )}
                onPress={onDecrement}
                disabled={isDisableIncreament}
              >
                <Ionicons
                  name="remove"
                  size={14}
                  color={isDisableIncreament ? "#aaa" : "white"}
                />
              </TouchableOpacity>

              <Text className="mx-3 font-jost">{qty}</Text>

              <TouchableOpacity
                className="px-3 py-2 bg-black border border-black rounded"
                onPress={onIncrement}
              >
                <Ionicons name="add" size={14} color="white" />
              </TouchableOpacity>
            </View>

            {/* Trash / Remove */}
            <View className="flex items-center justify-center h-10">
              <TouchableOpacity
                onPress={onRemove}
                hitSlop={8}
                className="items-center"
              >
                <Text className="text-base text-red-600 font-jost-semibold">
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <View className="flex-row items-center justify-between hidden mt-2">
        {/* Save for later */}
        <TouchableOpacity
          disabled
          className="px-4 py-2 border border-gray-300 rounded-xl w-fit"
        >
          <Text className="text-sm font-jost text-secondary">
            Save for later
          </Text>
        </TouchableOpacity>

        {/* Trash Icon */}
        <TouchableOpacity onPress={onRemove} hitSlop={8}>
          <Ionicons name="trash-outline" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartCard;
