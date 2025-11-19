import LabeledInput from "@/components/common/LabeledInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import ScrollableForm from "@/components/common/ScrollableForm";
import { useUpdateProfileMutation } from "@/hooks/useUpdateProfileMutation";
import { useAuth } from "@/providers/auth";
import { IUpdateUserPayload } from "@/services/user/user.types";
import { useEffect, useState } from "react";
import { Text } from "react-native";

const DeliveryAddress = () => {
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

export default DeliveryAddress;
