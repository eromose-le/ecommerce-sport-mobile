import ScrollableForm from "@/components/common/ScrollableForm";
import { BodyText } from "@/components/ui";
import { ThemePreference, useTheme, useThemedStyles } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const themeOptions: {
  key: ThemePreference;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "light",
    label: "Light",
    description: "Always use the light appearance",
    icon: "sunny-outline",
  },
  {
    key: "dark",
    label: "Dark",
    description: "Always use the dark appearance",
    icon: "moon-outline",
  },
  {
    key: "system",
    label: "System",
    description: "Follow your device appearance",
    icon: "phone-portrait-outline",
  },
];

const Appearance = () => {
  const theme = useThemedStyles();
  const { isDark, preference, setTheme } = useTheme();
  const accentColor = isDark ? "#f3f4f6" : "#111827";

  return (
    <ScrollableForm>
      <BodyText size="md" tone={theme.bodyTone} className="mb-4">
        Choose how Sporty Galaxy looks across the app. This affects every
        screen.
      </BodyText>

      <View
        className={`p-4 rounded-2xl border shadow-sm ${theme.surface} ${theme.primaryBorderColor}`}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons
            name="color-palette-outline"
            size={18}
            color={theme.iconMuted}
          />
          <BodyText size="md" weight="medium" tone={theme.headingTone}>
            Appearance
          </BodyText>
        </View>

        <View className="gap-3 mt-4">
          {themeOptions.map((option) => {
            const isSelected = option.key === preference;

            return (
              <TouchableOpacity
                key={option.key}
                className="flex-row items-center justify-between px-3 py-3 rounded-xl"
                style={{
                  backgroundColor: isDark ? "#111827" : "#F5F5F5",
                  borderColor: isSelected ? accentColor : "transparent",
                  borderWidth: isSelected ? 1 : 0,
                }}
                onPress={() => setTheme(option.key)}
                activeOpacity={0.9}
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={isSelected ? accentColor : theme.iconMuted}
                  />
                  <View className="gap-1">
                    <BodyText weight="medium" tone={theme.headingTone}>
                      {option.label}
                    </BodyText>
                    <BodyText size="sm" tone={theme.labelTone}>
                      {option.description}
                    </BodyText>
                  </View>
                </View>
                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={18}
                  color={isSelected ? accentColor : theme.iconMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollableForm>
  );
};

export default Appearance;
