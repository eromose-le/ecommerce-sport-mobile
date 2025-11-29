import { useTheme, useThemedStyles } from "@/providers/theme";
import { getKeyValue } from "@/utils/object";
import classNames from "classnames";
import React from "react";
import { View } from "react-native";
import { BodyText, Heading } from "../ui";

export default function ProductSpecifications({
  specifications,
  modelNumber,
}: {
  modelNumber: string;
  specifications: any;
}) {
  const { isDark } = useTheme();
  const theme = useThemedStyles();
  return (
    <View className="px-4 mt-8">
      <Heading level="h4" weight="bold" className="mb-3">
        Specifications
      </Heading>

      <View className="border">
        {[{ "Model Number": modelNumber }, ...specifications]?.map(
          (attr, i) => (
            <View
              key={i}
              className={classNames(
                "flex-row border-b border-b-black last:border-b-0",
                isDark ? theme.mutedSurface : "bg-background"
              )}
            >
              <View
                className={`w-40 p-3 ${isDark ? theme.mutedSurface : "bg-[#F0F0F0]"}`}
              >
                <BodyText size="sm" weight="medium">
                  {getKeyValue(attr)?.key}
                </BodyText>
              </View>

              <View className="flex-1 p-3">
                <BodyText size="xs" tone={theme.labelTone}>
                  {getKeyValue(attr)?.value}
                </BodyText>
              </View>
            </View>
          )
        )}
      </View>
    </View>
  );
}
