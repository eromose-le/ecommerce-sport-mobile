import { Toast } from "toastify-react-native";

type ToastVariant = "success" | "error" | "info" | "warn" | "default";

const showToast = (type: ToastVariant, message: string, sub?: string) => {
  Toast.show({
    type,
    text1: message,
    text2: sub,
    position: "bottom",
    bottomOffset: 10,
    visibilityTime: 5000,
    useModal: false, // Must be off for stack view
  });
};

export const AppToast = {
  success: (message: string, sub?: string) =>
    showToast("success", message, sub),
  failed: (message: string, sub?: string) => showToast("error", message, sub),
  pending: (message: string, sub?: string) => showToast("warn", message, sub),
  info: (message: string, sub?: string) => showToast("info", message, sub),
};

// USAGE
// AppToast.success("User created!");
// AppToast.failed("Login failed!");
// AppToast.pending("Processing request...");
// AppToast.info("Heads up!");
