import Modal from "@/components/common/Modal";
import { BodyText, Heading, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useThemedStyles } from "@/providers/theme";
import classNames from "classnames";
import React from "react";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PromptAction = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  textClassName?: string;
  spinnerColor?: string;
};

type ActionPromptProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  primaryAction: PromptAction;
  secondaryAction?: PromptAction;
  dismissOnBackdropPress?: boolean;
};

const ActionPrompt = ({
  visible,
  onClose,
  title,
  description,
  primaryAction,
  secondaryAction,
  dismissOnBackdropPress = true,
}: ActionPromptProps) => {
  const theme = useThemedStyles();

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="center"
      dismissOnBackdropPress={dismissOnBackdropPress}
      contentHeight="auto"
    >
      <SafeAreaView
        edges={["top", "bottom"]}
        className={classNames(
          "gap-3 pt-4",
          Platform.OS === "ios" ? "pb-10" : "pb-8"
        )}
      >
        <Heading
          level="h3"
          weight="semibold"
          tone={theme.headingTone}
          align="center"
        >
          {title}
        </Heading>
        {description ? (
          <BodyText size="sm" tone={theme.labelTone} align="center">
            {description}
          </BodyText>
        ) : null}
        <View className="flex-row gap-3 mt-2">
          <PrimaryButton
            title={primaryAction.title}
            onPress={primaryAction.onPress}
            loading={primaryAction.loading}
            loadingText={primaryAction.loadingText}
            className={`flex-1 ${theme.primaryButtonClass} ${primaryAction.className || ""}`}
            textClassName={`${theme.primaryTextClassInverse} ${primaryAction.textClassName || ""}`}
            spinnerColor={primaryAction.spinnerColor ?? theme.primarySpinnerColor}
          />
          {secondaryAction ? (
            <SecondaryButton
              title={secondaryAction.title}
              onPress={secondaryAction.onPress}
              loading={secondaryAction.loading}
              loadingText={secondaryAction.loadingText}
              className={`flex-1 ${theme.secondaryButtonClass} ${secondaryAction.className || ""}`}
              textClassName={`${theme.secondaryTextClass} ${secondaryAction.textClassName || ""}`}
              spinnerColor={
                secondaryAction.spinnerColor ?? theme.secondarySpinnerColor
              }
            />
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ActionPrompt;
