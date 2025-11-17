import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
  const defaultContainer =
    "items-center px-5 py-8 w-full border border-red-100 bg-red-50 rounded-2xl";

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
        <Text className="mb-0 text-center text-red-600 font-jost-medium">
          {error instanceof Error ? error?.message : "Something went wrong"}
        </Text>

        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="self-center px-3 py-1 mt-2 bg-red-500 rounded-full"
          >
            <Text className="text-xs text-white font-jost-medium">Retry</Text>
          </TouchableOpacity>
        )}
      </>
    </View>
  );
};
