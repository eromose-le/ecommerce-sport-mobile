import ScrollableForm from "@/components/common/ScrollableForm";
import { BodyText, Heading } from "@/components/ui";
import { COMPANY_INFO } from "@/constants/company";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";

const Support = () => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  const socialLinks = [
    {
      label: "Facebook",
      url: COMPANY_INFO.social.facebook,
      icon: "logo-facebook",
    },
    {
      label: "Instagram",
      url: COMPANY_INFO.social.instagram,
      icon: "logo-instagram",
    },
    { label: "X", url: COMPANY_INFO.social.x, icon: "logo-twitter" },
    { label: "Tiktok", url: COMPANY_INFO.social.tiktok, icon: "logo-tiktok" },
    {
      label: "Whatsapp",
      url: COMPANY_INFO.social.whatsapp,
      icon: "logo-whatsapp",
    },
  ];

  return (
    <ScrollableForm>
      <Heading
        level="h3"
        weight="bold"
        tone={theme.headingTone}
        className="mb-4"
      >
        Contact us
      </Heading>
      <BodyText size="sm" tone={theme.labelTone} className="mb-6">
        Have questions or feedback? Reach out via any of the channels below and
        we&apos;ll be happy to help.
      </BodyText>

      <View
        className="gap-3 p-4 border shadow-sm rounded-2xl"
        style={{
          borderColor: isDark ? "#1f2937" : "#e5e7eb",
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
        }}
      >
        <ContactRow
          icon="call-outline"
          label={`${COMPANY_INFO.countryCode} ${COMPANY_INFO.phoneNumbers[0]}`}
          url={`tel:${COMPANY_INFO.countryCode}${COMPANY_INFO.phoneNumbers[0]}`}
        />
        <ContactRow
          icon="mail-outline"
          label={COMPANY_INFO.email}
          url={`mailto:${COMPANY_INFO.email}`}
        />
        <ContactRow
          icon="location-outline"
          label={COMPANY_INFO.businessAddress}
        />
        <ContactRow
          icon="globe-outline"
          label={COMPANY_INFO.website}
          url={COMPANY_INFO.website}
        />
      </View>

      <BodyText
        size="sm"
        weight="medium"
        tone={theme.labelTone}
        className="mt-8"
      >
        Socials
      </BodyText>
      <View className="flex-row flex-wrap gap-3 mt-3">
        {socialLinks.map((link) => (
          <TouchableOpacity
            key={link.label}
            className="flex-row items-center gap-2 px-4 py-2 border rounded-full"
            style={{ borderColor: isDark ? "#1f2937" : "#e5e7eb" }}
            onPress={() => Linking.openURL(link.url)}
          >
            <Ionicons
              name={link.icon as any}
              size={18}
              color={theme.headingTone === "inverse" ? "#f5f5f5" : "#111"}
            />
            <BodyText size="sm" tone={theme.headingTone}>
              {link.label}
            </BodyText>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollableForm>
  );
};

export default Support;

const ContactRow = ({
  icon,
  label,
  url,
}: {
  icon: any;
  label: string;
  url?: string;
}) => {
  const theme = useThemedStyles();

  return (
    <TouchableOpacity
      disabled={!url}
      onPress={() => url && Linking.openURL(url)}
      className="flex-row items-center gap-3"
    >
      <Ionicons name={icon} size={18} color={theme.iconMuted} />
      <BodyText size="sm" tone={theme.labelTone} className="flex-1">
        {label}
      </BodyText>
      {url && (
        <Ionicons name="open-outline" size={16} color={theme.iconMuted} />
      )}
    </TouchableOpacity>
  );
};
