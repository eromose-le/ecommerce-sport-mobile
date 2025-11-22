import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AppLoader from "./AppLoader";
import { Logger } from "@/utils/logger";

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
          <Text className="mt-4 text-center text-sm text-secondary font-jost">
            Something went wrong. You can try again.
          </Text>
          <TouchableOpacity
            onPress={this.handleReset}
            className="mt-3 px-4 py-2 rounded-2xl bg-black"
            activeOpacity={0.8}
          >
            <Text className="text-white font-jost-medium text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
