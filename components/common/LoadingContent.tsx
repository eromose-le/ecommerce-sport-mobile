import React, { ReactNode } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";

interface LoadingContentProps<T = any> {
  loading: boolean;
  error?: any;
  data?: T | T[];
  children: ReactNode;
  onRetry?: () => void;

  // Optional override components
  LoadingComponent?: ReactNode;
  ErrorComponent?: (error: any, onRetry?: () => void) => ReactNode;
  EmptyComponent?: ReactNode;

  // Optional classNames for each UI state
  loadingClassName?: string;
  errorClassName?: string;
  emptyClassName?: string;
}

export const LoadingContent = <T,>({
  loading,
  error,
  data,
  children,
  onRetry,
  LoadingComponent,
  ErrorComponent,
  EmptyComponent,

  loadingClassName,
  errorClassName = "items-center px-5 py-4 w-[57%] border border-red-100 bg-red-50 rounded-2xl",
  emptyClassName = "items-center px-5 py-4 w-[57%] border border-background bg-white rounded-2xl",
}: LoadingContentProps<T>) => {
  const defaultContainer = "items-center justify-center flex-1";

  /** ---------- LOADING ---------- **/
  if (loading) {
    return (
      <View className={loadingClassName || defaultContainer}>
        {LoadingComponent || <ActivityIndicator size="small" />}
      </View>
    );
  }

  /** ---------- ERROR ---------- **/
  if (error) {
    return (
      <View className={errorClassName || defaultContainer}>
        {ErrorComponent ? (
          ErrorComponent(error, onRetry)
        ) : (
          <>
            <Text className="mb-0 text-center text-red-600 font-jost-medium">
              {error instanceof Error ? error.message : "Something went wrong"}
            </Text>
            {onRetry && (
              <TouchableOpacity
                onPress={onRetry}
                className="self-center px-3 py-1 mt-2 bg-red-500 rounded-full"
              >
                <Text className="text-xs font-medium text-white font-jost-medium">
                  Retry
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  }

  /** ---------- EMPTY ---------- **/
  const isEmpty =
    data === undefined ||
    data === null ||
    (Array.isArray(data) && data.length === 0);

  if (isEmpty) {
    return (
      <View className={emptyClassName || defaultContainer}>
        {EmptyComponent || (
          <>
            <Text className="font-jost-medium">No data available</Text>
            <TouchableOpacity
              onPress={onRetry}
              className="self-center px-3 py-1 mt-2 bg-green-500 rounded-full"
            >
              <Text className="text-xs font-medium text-white font-jost-medium">
                Reload
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  /** ---------- SUCCESS ---------- **/
  return <>{children}</>;
};
