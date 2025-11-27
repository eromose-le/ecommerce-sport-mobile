import { Logger } from "@/utils/logger";
import React from "react";
import { Text, View } from "react-native";
import { PrimaryButton } from "../ui";
import AppLoader from "./AppLoader";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    Logger.error("ErrorBoundary caught an error", { error, info });
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View className="items-center justify-center flex-1 px-6">
          <AppLoader />
          <Text className="mt-4 text-sm text-center text-secondary font-jost">
            Something went wrong. You can try again.
          </Text>

          <View className="mt-3">
            <PrimaryButton size="sm" title="Retry" onPress={this.handleReset} />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
