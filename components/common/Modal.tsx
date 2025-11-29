import { Ionicons } from "@expo/vector-icons";
import classNames from "classnames";
import React from "react";
import {
  DimensionValue,
  KeyboardAvoidingView,
  Platform,
  Modal as ReactNativeModal,
  StyleProp,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemedStyles } from "@/providers/theme";

type ModalVariant = "bottom" | "center";

type ModalProps = {
  visible: boolean;
  onClose: () => void;

  /** "bottom" = sheet from bottom (default), "center" = centered card */
  variant?: ModalVariant;

  /**
   * Explicit content height.
   * Uses React Native's DimensionValue (number | percentage string).
   * If not provided, height will wrap content.
   */
  contentHeight?: DimensionValue;

  /**
   * Extra padding from the bottom (in px).
   * For "bottom" variant we also automatically add safe-area bottom.
   */
  bottomPadding?: number;

  /**
   * If true (with variant="bottom"), the sheet occupies almost
   * the entire vertical space from the bottom (like a full bottom sheet).
   */
  occupyFullBottom?: boolean;

  /** Extra style override for the sheet container */
  contentStyle?: StyleProp<ViewStyle>;

  /** Content rendered inside the modal (inside KeyboardAvoidingView) */
  children: React.ReactNode;

  /**
   * If true (default), tapping on the dimmed background closes the modal.
   * If false, backdrop is non-interactive (only header or explicit buttons close it).
   */
  dismissOnBackdropPress?: boolean;
};

const Modal = ({
  visible,
  onClose,
  variant = "bottom",
  contentHeight,
  bottomPadding,
  occupyFullBottom = false,
  contentStyle,
  children,
  dismissOnBackdropPress = true,
}: ModalProps) => {
  const insets = useSafeAreaInsets();
  const theme = useThemedStyles();

  const isBottomVariant = variant === "bottom";

  // bottom padding respects safe area + custom padding
  const computedBottomPadding =
    bottomPadding ?? (isBottomVariant ? insets.bottom + 16 : insets.bottom);

  // base style for the content container
  const baseContentStyle: ViewStyle = {
    paddingBottom: computedBottomPadding,
  };

  // safe assignment using DimensionValue (fixes TS error)
  if (contentHeight != null) {
    baseContentStyle.height = contentHeight;
  }

  const contentBaseClass = isBottomVariant
    ? "relative rounded-t-3xl px-5 pt-5"
    : "relative rounded-3xl px-5 pt-5";

  const contentClassName = classNames(contentBaseClass, theme.mutedSurface);

  return (
    <ReactNativeModal
      visible={visible}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View
        className={`flex-1 bg-black/40 ${
          isBottomVariant ? "justify-end" : "justify-center items-center"
        }`}
      >
        {/* Tap outside to close (conditionally) */}
        <TouchableWithoutFeedback
          onPress={dismissOnBackdropPress ? onClose : undefined}
        >
          <View className="absolute inset-0" pointerEvents="box-only" />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          pointerEvents="box-none"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.select({ ios: 10, android: 10 })}
          style={[
            baseContentStyle,
            isBottomVariant && occupyFullBottom
              ? { width: "100%", maxHeight: "90%" } // almost full screen from bottom
              : isBottomVariant
                ? { width: "100%" }
                : { width: "90%", maxWidth: 420 }, // centered card width
            contentStyle,
          ]}
          className={contentClassName}
        >
          <TouchableOpacity
            className={classNames(
              "absolute top-5 right-5 z-10 p-1 rounded-full border",
              theme.primaryBorderColor
            )}
            onPress={onClose}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={theme.iconMuted} />
          </TouchableOpacity>

          {children}
        </KeyboardAvoidingView>
      </View>
    </ReactNativeModal>
  );
};

export default Modal;
