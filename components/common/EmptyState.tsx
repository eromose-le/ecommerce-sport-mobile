import { useTheme, useThemedStyles } from "@/providers/theme";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import classNames from "classnames";
import { BodyText } from "../ui";

interface EmptyStateProps {
  error?: any;
  onRetry?: () => void;
  className?: string; // override styles
  EmptyComponent?: (error: any, onRetry?: () => void) => React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  error,
  onRetry,
  className,
  EmptyComponent,
  icon,
}) => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  const defaultContainer = classNames(
    "items-center px-5 py-8 w-full border rounded-2xl",
    theme.mutedSurface || theme.surface
  );
  const retryButtonClass = classNames(
    "self-center px-3 py-1 mt-2 rounded-full",
    isDark ? "bg-white" : "bg-black"
  );
  const retryTextTone = isDark ? "primary" : "inverse";

  if (EmptyComponent) {
    return (
      <View className={className || defaultContainer}>
        {EmptyComponent(error, onRetry)}
      </View>
    );
  }

  return (
    <View className={className || defaultContainer}>
      <>
        {icon}

        <BodyText
          weight="medium"
          tone={theme.bodyTone}
          align="center"
          className="mb-0"
        >
          {error ? error : "No data available"}
        </BodyText>

        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className={retryButtonClass}
          >
            <BodyText size="xs" weight="medium" tone={retryTextTone}>
              Retry
            </BodyText>
          </TouchableOpacity>
        )}
      </>
    </View>
  );
};
