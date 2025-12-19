import { ProfileLink } from "@/types/profile";

export const profileKeys = {
  myOrders: "my-orders",
  userProfile: "user-profile",
  appearance: "appearance",
  pushNotifications: "push-notifications",
  paymentMethods: "payment-methods",
  deliveryAddress: "delivery-address",
  appLock: "app-lock",
  notifications: "notifications",
  faq: "faq",
  support: "support",
  privacyPolicy: "privacy-policy",
  terms: "terms",
};

export const settingsLinks: ProfileLink[] = [
  {
    key: profileKeys.userProfile,
    label: "User profile",
    icon: "person-outline",
  },
  {
    key: profileKeys.appearance,
    label: "Appearance",
    icon: "color-palette-outline",
  },
  {
    key: profileKeys.paymentMethods,
    label: "Payment methods",
    icon: "wallet-outline",
  },
  {
    key: profileKeys.deliveryAddress,
    label: "Delivery address",
    icon: "location-outline",
  },
  {
    key: profileKeys.appLock,
    label: "App security",
    icon: "lock-closed-outline",
  },
  // {
  //   key: profileKeys.notifications,
  //   label: "Notifications",
  //   icon: "notifications-outline",
  // },
];

export const helpLinks: ProfileLink[] = [
  { key: profileKeys.faq, label: "FAQ", icon: "help-circle-outline" },
  {
    key: profileKeys.support,
    label: "Support",
    icon: "chatbubble-ellipses-outline",
  },
];

export const legalLinks: ProfileLink[] = [
  {
    key: profileKeys.privacyPolicy,
    label: "Privacy policy",
    icon: "document-text-outline",
  },
  {
    key: profileKeys.terms,
    label: "Terms & Conditions",
    icon: "reader-outline",
  },
];

export const SCREEN_LABELS: Record<string, string> = {
  [profileKeys.myOrders]: "My Orders",
  [profileKeys.userProfile]: "User profile",
  [profileKeys.appearance]: "Appearance",
  [profileKeys.pushNotifications]: "Push notifications",
  [profileKeys.paymentMethods]: "Payment methods",
  [profileKeys.deliveryAddress]: "Delivery address",
  [profileKeys.appLock]: "App security",
  [profileKeys.faq]: "FAQ",
  [profileKeys.support]: "Support",
  [profileKeys.privacyPolicy]: "Privacy policy",
  [profileKeys.terms]: "Terms & Conditions",
};
