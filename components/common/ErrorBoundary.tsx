import { useThemedStyles } from "@/providers/theme";
import { Logger } from "@/utils/logger";
import React from "react";
import { View } from "react-native";
import { BodyText, PrimaryButton } from "../ui";
import AppLoader from "./AppLoader";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

const ErrorBoundaryFallback: React.FC<{ onRetry: () => void }> = ({
  onRetry,
}) => {
  const theme = useThemedStyles();

  return (
    <View className={`items-center justify-center flex-1 px-6 ${theme.pageBg}`}>
      <AppLoader />
      <BodyText
        size="sm"
        tone={theme.labelTone}
        align="center"
        className="mt-4"
      >
        Something went wrong. You can try again.
      </BodyText>

      <View className="mt-3">
        <PrimaryButton
          size="sm"
          title="Retry"
          onPress={onRetry}
          textClassName={theme.primaryTextClassInverse}
          spinnerColor={theme.primarySpinnerColor}
        />
      </View>
    </View>
  );
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

      return <ErrorBoundaryFallback onRetry={this.handleReset} />;
    }

    return this.props.children;
  }
}
