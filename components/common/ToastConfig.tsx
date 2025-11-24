import { Ionicons } from "@expo/vector-icons";
import React, { JSX } from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { ToastAnimate } from "./ToastAnimate";
import { ToastStack } from "./ToastStack";

// Base container (white card, shadow)
const baseWrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingInline: 20,
  paddingBlock: 10,
  borderRadius: 12,
  marginBottom: 40,
  backgroundColor: "#fff",
  borderWidth: 1,
  width: "85%", // optional

  // soft shadow
  shadowColor: "#000",
  shadowOpacity: 0.11,
  shadowRadius: 6,
  elevation: 4,
};

const textStyles = (color: string): { title: TextStyle; sub: TextStyle } => ({
  title: {
    color,
    fontWeight: "500",
    fontSize: 14,
    textTransform: "none",
  },
  sub: {
    color,
    fontSize: 13,
    marginTop: 2,
  },
});

type ConfigComponent = (props: any) => JSX.Element;

export const toastConfig: Record<string, ConfigComponent> = {
  success: ({ text1, text2 }) => {
    const color = "#22c55e"; // green
    return (
      <ToastStack>
        <ToastAnimate>
          <View
            style={[
              baseWrapper,
              { borderColor: color, borderWidth: 0, shadowColor: color },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={14}
              color={color}
              style={{ marginRight: 6 }}
            />
            <View style={{ flexShrink: 1 }}>
              <Text style={textStyles(color).title}>{text1}</Text>
              {text2 && <Text style={textStyles(color).sub}>{text2}</Text>}
            </View>
          </View>
        </ToastAnimate>
      </ToastStack>
    );
  },

  error: ({ text1, text2 }) => {
    const color = "#ef4444"; // red
    return (
      <ToastStack>
        <ToastAnimate>
          <View
            style={[
              baseWrapper,
              { borderColor: color, borderWidth: 0, shadowColor: color },
            ]}
          >
            <Ionicons
              name="close-circle"
              size={14}
              color={color}
              style={{ marginRight: 6 }}
            />
            <View style={{ flexShrink: 1 }}>
              <Text style={textStyles(color).title}>{text1}</Text>
              {text2 && <Text style={textStyles(color).sub}>{text2}</Text>}
            </View>
          </View>
        </ToastAnimate>
      </ToastStack>
    );
  },

  warn: ({ text1, text2 }) => {
    const color = "#f59e0b"; // yellow
    return (
      <ToastStack>
        <ToastAnimate>
          <View
            style={[
              baseWrapper,
              { borderColor: color, borderWidth: 0, shadowColor: color },
            ]}
          >
            <Ionicons
              name="warning"
              size={14}
              color={color}
              style={{ marginRight: 6 }}
            />
            <View style={{ flexShrink: 1 }}>
              <Text style={textStyles(color).title}>{text1}</Text>
              {text2 && <Text style={textStyles(color).sub}>{text2}</Text>}
            </View>
          </View>
        </ToastAnimate>
      </ToastStack>
    );
  },

  info: ({ text1, text2 }) => {
    const color = "#3b82f6"; // blue
    return (
      <ToastStack>
        <ToastAnimate>
          <View
            style={[
              baseWrapper,
              { borderColor: color, borderWidth: 0, shadowColor: color },
            ]}
          >
            <Ionicons
              name="information-circle"
              size={14}
              color={color}
              style={{ marginRight: 6 }}
            />
            <View style={{ flexShrink: 1 }}>
              <Text style={textStyles(color).title}>{text1}</Text>
              {text2 && <Text style={textStyles(color).sub}>{text2}</Text>}
            </View>
          </View>
        </ToastAnimate>
      </ToastStack>
    );
  },
};
