import LabeledInput from "@/components/common/LabeledInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import ScrollableForm from "@/components/common/ScrollableForm";
import { useUpdateProfileMutation } from "@/hooks/useUpdateProfileMutation";
import { useAuth } from "@/providers/auth";
import { IUpdateUserPayload } from "@/services/user/user.types";
import { useEffect, useState } from "react";
import { Text } from "react-native";

const UserProfile = () => {
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

export default UserProfile;
