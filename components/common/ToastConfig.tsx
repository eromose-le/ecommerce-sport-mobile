import React, { JSX } from "react";
import { View, Text, ViewStyle } from "react-native";

const baseStyle: ViewStyle = {
  padding: 16,
  borderRadius: 10,
  width: "90%",
};

type ConfigComponent = (props: any) => JSX.Element;

export const toastConfig: Record<string, ConfigComponent> = {
  success: ({ text1, text2 }) => (
    <View style={[baseStyle, { backgroundColor: "#22c55e" }]}>
      <Text style={{ color: "white", fontWeight: "bold" }}>{text1}</Text>
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),

  failed: ({ text1, text2 }) => (
    <View style={[baseStyle, { backgroundColor: "#ef4444" }]}>
      <Text style={{ color: "white", fontWeight: "bold" }}>{text1}</Text>
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),

  pending: ({ text1, text2 }) => (
    <View style={[baseStyle, { backgroundColor: "#f59e0b" }]}>
      <Text style={{ color: "white", fontWeight: "bold" }}>{text1}</Text>
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View style={[baseStyle, { backgroundColor: "#3b82f6" }]}>
      <Text style={{ color: "white", fontWeight: "bold" }}>{text1}</Text>
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
};
