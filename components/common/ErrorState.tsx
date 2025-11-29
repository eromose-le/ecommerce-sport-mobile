import { useTheme } from "@/providers/theme";
import classNames from "classnames";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { BodyText } from "../ui";

interface ErrorStateProps {
  error?: any;
  onRetry?: () => void;
  className?: string; // override styles
  ErrorComponent?: (error: any, onRetry?: () => void) => React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className,
  ErrorComponent,
}) => {
  const { isDark } = useTheme();
  const defaultContainer = classNames(
    "items-center px-5 py-8 w-full border rounded-2xl",
    isDark ? "border-red-900/50 bg-red-900/20" : "border-red-100 bg-red-50"
  );
  const retryClass = classNames(
    "self-center px-3 py-1 mt-2 rounded-full",
    isDark ? "bg-red-500/90" : "bg-red-500"
  );

  if (ErrorComponent) {
    return (
      <View className={className || defaultContainer}>
        {ErrorComponent(error, onRetry)}
      </View>
    );
  }

  return (
    <View className={className || defaultContainer}>
      <>
        <BodyText align="center" weight="medium" tone="danger" className="mb-0">
          {error instanceof Error ? error?.message : "Something went wrong"}
        </BodyText>

        {onRetry && (
          <TouchableOpacity onPress={onRetry} className={retryClass}>
            <BodyText size="xs" weight="medium" tone="inverse">
              Retry
            </BodyText>
          </TouchableOpacity>
        )}
      </>
    </View>
  );
};
