import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  error?: any;
  onRetry?: () => void;
  className?: string; // override styles
  EmptyComponent?: (error: any, onRetry?: () => void) => React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  error,
  onRetry,
  className,
  EmptyComponent,
}) => {
  const defaultContainer =
    "items-center px-5 py-8 w-full border border-background bg-white rounded-2xl";

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
        <Text className="mb-0 text-center font-jost-medium">
          {error ? error : "No data available"}
        </Text>

        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="self-center px-3 py-1 mt-2 bg-green-500 rounded-full"
          >
            <Text className="text-xs font-medium text-white font-jost-medium">
              Retry
            </Text>
          </TouchableOpacity>
        )}
      </>
    </View>
  );
};
