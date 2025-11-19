import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import ScrollableForm from '@/components/common/ScrollableForm';
import { COMPANY_INFO } from '@/constants/company';
import { Ionicons } from '@expo/vector-icons';

const Support = () => {
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
      <Text className="mb-4 text-lg font-jost-bold text-primary">
        Contact us
      </Text>
      <Text className="mb-6 text-sm text-secondary">
        Have questions or feedback? Reach out via any of the channels below and
        we&apos;ll be happy to help.
      </Text>

      <View className="gap-3 p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
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

      <Text className="mt-8 text-sm font-jost-medium text-secondary">
        Socials
      </Text>
      <View className="flex-row flex-wrap gap-3 mt-3">
        {socialLinks.map((link) => (
          <TouchableOpacity
            key={link.label}
            className="flex-row items-center gap-2 px-4 py-2 border border-gray-200 rounded-full"
            onPress={() => Linking.openURL(link.url)}
          >
            <Ionicons name={link.icon as any} size={18} color="#111" />
            <Text className="text-sm text-primary">{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollableForm>
  );
}

export default Support

const ContactRow = ({
  icon,
  label,
  url,
}: {
  icon: any;
  label: string;
  url?: string;
}) => (
  <TouchableOpacity
    disabled={!url}
    onPress={() => url && Linking.openURL(url)}
    className="flex-row items-center gap-3"
  >
    <Ionicons name={icon} size={18} color="#4B5563" />
    <Text className="flex-1 text-sm text-secondary">{label}</Text>
    {url && <Ionicons name="open-outline" size={16} color="#9CA3AF" />}
  </TouchableOpacity>
);