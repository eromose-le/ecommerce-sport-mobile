import React, { ReactNode } from "react";
import { View } from "react-native";
import AppLoader from "./AppLoader";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

interface LoadingContentProps<T = any> {
  loading: boolean;
  error?: any;
  data?: T | T[];
  children: ReactNode;
  onRetry?: () => void;

  // Optional override components
  LoadingComponent?: ReactNode;
  ErrorComponent?: (error: any, onRetry?: () => void) => ReactNode;
  EmptyComponent?: (error: any, onRetry?: () => void) => ReactNode;

  // Optional classNames for each UI state
  loadingClassName?: string;
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
}: LoadingContentProps<T>) => {
  const defaultContainer = "items-center justify-center flex-1 mt-4";

  /** ---------- LOADING ---------- **/
  if (loading) {
    return (
      <View className={loadingClassName || defaultContainer}>
        {LoadingComponent || <AppLoader />}
      </View>
    );
  }

  /** ---------- ERROR ---------- **/
  if (error) {
    return ErrorComponent ? (
      ErrorComponent(error, onRetry)
    ) : (
      <View className="mt-4">
        <ErrorState error={error} onRetry={onRetry} />
      </View>
    );
  }

  /** ---------- EMPTY ---------- **/
  const isEmpty =
    data === undefined ||
    data === null ||
    (Array.isArray(data) && data.length === 0);

  if (isEmpty) {
    return EmptyComponent ? (
      EmptyComponent(error, onRetry)
    ) : (
      <View className="mt-4">
        <EmptyState error={error} onRetry={onRetry} />
      </View>
    );
  }

  /** ---------- SUCCESS ---------- **/
  return <>{children}</>;
};
