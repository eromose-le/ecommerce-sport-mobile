import { COMPANY_INFO } from "@/constants/company";
import { PRODUCT_DETAIL } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { OrderService, UserService } from "@/services/api";
import { Order, OrderItem } from "@/services/order/order.types";
import { IUpdateUserPayload } from "@/services/user/user.types";
import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_LABELS: Record<string, string> = {
  "my-orders": "My Orders",
  "user-profile": "User profile",
  "payment-methods": "Payment methods",
  "delivery-address": "Delivery address",
  faq: "FAQ",
  support: "Support",
  "privacy-policy": "Privacy policy",
  terms: "Terms & Conditions",
};

type ScreenKey = keyof typeof SCREEN_LABELS;

type ScreenComponentProps = {
  screenKey: ScreenKey;
};

const SCREEN_COMPONENTS: Partial<
  Record<ScreenKey, React.FC<ScreenComponentProps>>
> = {
  "my-orders": () => <OrdersScreen />,
  "user-profile": () => <ProfileDetailsScreen />,
  "delivery-address": () => <DeliveryAddressScreen />,
  "payment-methods": () => <PaymentMethodsScreen />,
  faq: () => <FaqScreen />,
  support: () => <SupportScreen />,
  "privacy-policy": () => <PolicyScreen type="privacy" />,
  terms: () => <PolicyScreen type="terms" />,
};

export default function ProfileDetailScreen() {
  const params = useLocalSearchParams<{ screen?: string }>();
  const screenKey = (params.screen as ScreenKey) || "user-profile";
  const ScreenComponent = SCREEN_COMPONENTS[screenKey] ?? ComingSoonScreen;
  const title = SCREEN_LABELS[screenKey] || "Profile";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text className="flex-1 pr-8 text-lg text-center font-jost-bold text-primary">
          {title}
        </Text>
      </View>

      <View className="flex-1">
        <ScreenComponent screenKey={screenKey} />
      </View>
    </SafeAreaView>
  );
}

/** ORDERS **/
const OrdersScreen = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["orders", user?.id, page],
    queryFn: () =>
      OrderService.fetchOrders({
        userId: user?.id as string,
        page,
        limit,
      }),
    enabled: !!user?.id,
    staleTime: 1000 * 30,
  });

  const orders = data?.data?.results ?? [];
  const totalPages = data?.data?.pageCount ?? 1;

  if (!user?.id) {
    return (
      <EmptyState message="Sign in to view your orders." icon="cart-outline" />
    );
  }

  return (
    <ScrollView
      className="flex-1 px-6 pt-6"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
    >
      {isLoading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" />
        </View>
      ) : orders.length === 0 ? (
        <EmptyState message="No orders yet" icon="bag-handle-outline" />
      ) : (
        orders.map((order) => (
          <View
            key={String(order.id)}
            className="p-4 mb-6 border border-gray-100 shadow-sm rounded-2xl"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-base font-jost-semibold text-primary">
                  Order #{order.id}
                </Text>
                <Text className="text-xs text-secondary">
                  {formatDate(order.createdAt)} · {order.status}
                </Text>
              </View>
              <StatusPill status={order.status} />
            </View>

            {(order.items ?? []).map((item) => (
              <OrderItemRow
                key={`${order.id}-${item.productId}-${item.orderId}`}
                order={order}
                item={item}
              />
            ))}
          </View>
        ))
      )}

      {totalPages > 1 && (
        <View className="flex-row items-center justify-center gap-4 pt-4 pb-10">
          <PaginationButton
            icon="chevron-back"
            disabled={page === 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          />
          <Text className="text-sm text-secondary">
            Page {page} of {totalPages}
          </Text>
          <PaginationButton
            icon="chevron-forward"
            disabled={page === totalPages}
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </View>
      )}
    </ScrollView>
  );
};

const OrderItemRow = ({ order, item }: { order: Order; item: OrderItem }) => {
  const product = item?.product;
  const handleViewProduct = () => {
    if (!product?.id) return;
    router.push({
      pathname: PRODUCT_DETAIL,
      params: { id: String(product?.id) },
    });
  };

  return (
    <View className="flex-row items-center gap-4 py-3 border-t border-gray-100">
      <Image
        source={{
          uri: product?.displayImage || "https://via.placeholder.com/80",
        }}
        className="w-16 h-16 rounded-lg"
      />
      <View className="flex-1">
        <Text
          className="text-sm font-jost-medium text-primary"
          numberOfLines={2}
        >
          {product?.name || "Unnamed product"}
        </Text>
        <Text className="text-xs text-secondary">
          Qty: {item?.quantity ?? 1}
        </Text>
        <Text className="text-xs text-secondary">Item #{item?.orderId}</Text>
      </View>
      <TouchableOpacity
        onPress={handleViewProduct}
        className="px-4 py-2 border rounded-full border-primary"
      >
        <Text className="text-xs font-jost-medium text-primary">View</Text>
      </TouchableOpacity>
    </View>
  );
};

const StatusPill = ({ status }: { status: string }) => {
  const normalized = status?.toLowerCase();
  const colorMap: Record<string, string> = {
    delivered: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const classes = colorMap[normalized] || "bg-blue-100 text-blue-700";
  return (
    <View className={`rounded-full px-3 py-1 ${classes}`}>
      <Text className="text-xs capitalize">{status}</Text>
    </View>
  );
};

const PaginationButton = ({
  icon,
  disabled,
  onPress,
}: {
  icon: any;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    className={`rounded-full border border-gray-200 p-2 ${disabled ? "opacity-40" : ""}`}
  >
    <Ionicons name={icon} size={18} color="#111" />
  </TouchableOpacity>
);

/** PROFILE FORMS **/
const ProfileDetailsScreen = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    location: user?.location || "",
  });
  const updateProfile = useUpdateProfileMutation();

  useEffect(() => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      location: user?.location || "",
    });
  }, [user]);

  const handleSave = () => {
    const payload: IUpdateUserPayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      location: form.location.trim(),
    };
    updateProfile.mutate(payload);
  };

  return (
    <ScrollableForm>
      <Text className="mb-4 text-sm text-secondary">
        Update your basic profile information. These details are used to
        personalize your experience.
      </Text>
      <LabeledInput
        label="First name"
        value={form.firstName}
        onChangeText={(text) => setForm((p) => ({ ...p, firstName: text }))}
      />
      <LabeledInput
        label="Last name"
        value={form.lastName}
        onChangeText={(text) => setForm((p) => ({ ...p, lastName: text }))}
      />
      <LabeledInput label="Email" value={form.email} editable={false} />
      <LabeledInput
        label="Phone"
        value={form.phone}
        onChangeText={(text) => setForm((p) => ({ ...p, phone: text }))}
        keyboardType="phone-pad"
      />
      <LabeledInput
        label="Location"
        value={form.location}
        onChangeText={(text) => setForm((p) => ({ ...p, location: text }))}
      />
      <LabeledInput
        label="Address"
        value={form.address}
        multiline
        onChangeText={(text) => setForm((p) => ({ ...p, address: text }))}
      />
      <PrimaryButton
        onPress={handleSave}
        loading={updateProfile.isPending}
        title="Save changes"
      />
    </ScrollableForm>
  );
};

const DeliveryAddressScreen = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    address: user?.address || "",
    location: user?.location || "",
    phone: user?.phone || "",
  });
  const updateProfile = useUpdateProfileMutation();

  useEffect(() => {
    setForm({
      address: user?.address || "",
      location: user?.location || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleSave = () => {
    const payload: IUpdateUserPayload = {
      address: form.address.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
    };
    updateProfile.mutate(payload);
  };

  return (
    <ScrollableForm>
      <Text className="mb-4 text-sm text-secondary">
        Keep your delivery information accurate to avoid shipping delays.
      </Text>
      <LabeledInput
        label="Phone"
        value={form.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => setForm((p) => ({ ...p, phone: text }))}
      />
      <LabeledInput
        label="Location"
        value={form.location}
        onChangeText={(text) => setForm((p) => ({ ...p, location: text }))}
      />
      <LabeledInput
        label="Full address"
        value={form.address}
        multiline
        onChangeText={(text) => setForm((p) => ({ ...p, address: text }))}
      />
      <PrimaryButton
        onPress={handleSave}
        loading={updateProfile.isPending}
        title="Update address"
      />
    </ScrollableForm>
  );
};

const PaymentMethodsScreen = () => (
  <ScrollableForm>
    <Text className="mb-6 text-sm text-secondary">
      Manage your saved payment methods. Support for in-app payment management
      is coming soon.
    </Text>
    <View className="items-center p-6 border border-gray-300 border-dashed rounded-2xl">
      <Ionicons name="card-outline" size={36} color="#9CA3AF" />
      <Text className="mt-3 text-base font-jost-medium text-secondary">
        No saved cards yet
      </Text>
      <Text className="mt-1 text-xs text-center text-secondary">
        Our team is working on secure card storage so you can checkout even
        faster.
      </Text>
    </View>
  </ScrollableForm>
);

/** HELP **/
const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Shipping typically takes 3–5 business days within the country. International orders may take up to 14 business days.",
  },
  {
    question: "Can I return an item?",
    answer:
      "Yes, you can return any unused item within 7 days of delivery. Please ensure it is in its original packaging.",
  },
  {
    question: "Do you offer bulk purchase discounts?",
    answer:
      "Absolutely! Contact our sales team for discounted pricing on bulk orders.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking link via email. You can also check your order status in your account dashboard.",
  },
];

const FaqScreen = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ScrollableForm>
      <Text className="mb-6 text-lg text-center font-jost-bold text-primary">
        Frequently Asked Questions
      </Text>
      {faqs.map((faq, index) => (
        <View
          key={faq.question}
          className="mb-3 bg-white border border-gray-100 shadow-sm rounded-2xl"
        >
          <TouchableOpacity
            onPress={() =>
              setOpenIndex((prev) => (prev === index ? null : index))
            }
            className="flex-row items-center justify-between px-4 py-3"
          >
            <Text className="flex-1 pr-4 text-base font-jost-medium text-primary">
              {faq.question}
            </Text>
            <Ionicons
              name={openIndex === index ? "chevron-up" : "chevron-down"}
              size={18}
              color="#4B5563"
            />
          </TouchableOpacity>
          {openIndex === index && (
            <Text className="px-4 pb-4 text-sm text-secondary">
              {faq.answer}
            </Text>
          )}
        </View>
      ))}
    </ScrollableForm>
  );
};

const SupportScreen = () => {
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
};

/** POLICIES **/
const policySections = {
  privacy: [
    {
      title: "Data usage",
      description:
        "We only collect the information required to process orders, provide support, and enhance your experience.",
    },
    {
      title: "Data sharing",
      description:
        "We never sell personal data. Information is only shared with trusted logistics and payment partners when necessary.",
    },
    {
      title: "Your controls",
      description:
        "You can request updates or deletion of your data at any time by contacting support@sportygalaxy.com.",
    },
  ],
  terms: [
    {
      title: "Purchases & returns",
      description:
        "All sales are subject to our warranty and return policy. Items can be returned within 14 days in original condition.",
    },
    {
      title: "Warranties",
      description:
        "Select products include manufacturer warranties. Otherwise, Sporty Galaxy provides a limited 6-month warranty on defects.",
    },
    {
      title: "Customer rights",
      description:
        "You are entitled to transparent pricing, fair treatment, and safe products as stipulated by the FCCPC.",
    },
  ],
};

const PolicyScreen = ({ type }: { type: "privacy" | "terms" }) => (
  <ScrollableForm>
    <Text className="mb-4 text-lg font-jost-bold text-primary">
      {type === "privacy" ? "Privacy policy" : "Terms & conditions"}
    </Text>
    {policySections[type].map((section) => (
      <View
        key={section.title}
        className="p-4 mb-4 bg-white border border-gray-100 shadow-sm rounded-2xl"
      >
        <Text className="mb-2 text-base font-jost-semibold text-primary">
          {section.title}
        </Text>
        <Text className="text-sm text-secondary">{section.description}</Text>
      </View>
    ))}
    <Text className="mt-6 text-xs text-secondary">
      For full legal documentation, contact us via {COMPANY_INFO.email}.
    </Text>
  </ScrollableForm>
);

/** UTILITIES **/
const useUpdateProfileMutation = () => {
  const { user, login } = useAuth();
  return useMutation({
    mutationFn: (payload: IUpdateUserPayload) => {
      if (!user?.id) throw new Error("Missing user id");
      return UserService.updateUser(payload, { id: user.id });
    },
    onSuccess: async (res) => {
      if (res?.data) {
        await login(res.data);
      }
      AppToast.success(res?.message || "Profile updated");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Unable to update profile";
      AppToast.failed(msg);
    },
  });
};

const ScrollableForm = ({ children }: { children: React.ReactNode }) => (
  <ScrollView
    className="flex-1 px-6 pt-6"
    contentInsetAdjustmentBehavior="automatic"
  >
    {children}
  </ScrollView>
);

const LabeledInput = ({
  label,
  value,
  onChangeText,
  multiline,
  editable = true,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  editable?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-jost-medium text-primary">{label}</Text>
    <TextInput
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType}
      placeholder={label}
      className={`rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-jost text-secondary ${
        multiline ? "min-h-[90px]" : ""
      } ${editable ? "" : "bg-gray-50"}`}
    />
  </View>
);

const PrimaryButton = ({
  title,
  onPress,
  loading,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    className={`mt-2 rounded-2xl bg-black py-4 ${loading ? "opacity-60" : ""}`}
  >
    <Text className="text-base text-center text-white font-jost-medium">
      {loading ? "Saving..." : title}
    </Text>
  </TouchableOpacity>
);

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

const EmptyState = ({ message, icon }: { message: string; icon: any }) => (
  <View className="items-center justify-center py-20">
    <Ionicons name={icon} size={40} color="#D1D5DB" />
    <Text className="mt-4 text-sm text-secondary">{message}</Text>
  </View>
);

const ComingSoonScreen = () => (
  <ScrollableForm>
    <EmptyState
      message="This screen will be available soon."
      icon="hourglass-outline"
    />
  </ScrollableForm>
);

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString();
};
