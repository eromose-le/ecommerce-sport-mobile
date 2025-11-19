import LabeledInput from "@/components/common/LabeledInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import ScrollableForm from "@/components/common/ScrollableForm";
import { useUpdateProfileMutation } from "@/hooks/useUpdateProfileMutation";
import { useAuth } from "@/providers/auth";
import { IUpdateUserPayload } from "@/services/user/user.types";
import { getFormikTextFieldProps } from "@/utils/formik";
import { Logger } from "@/utils/logger";
import { useFormik } from "formik";
import { Text } from "react-native";
import { InferType, object, string } from "yup";

const deliveryAddressSchema = object({
  phone: string().trim().required("Phone is required"),
  address: string().trim().required("Full address is required"),
});

type DeliveryAddressFormValues = InferType<typeof deliveryAddressSchema>;

const DeliveryAddress = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfileMutation();
  const formik = useFormik<DeliveryAddressFormValues>({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      address: user?.address || "",
      phone: user?.phone || "",
    },
    validationSchema: deliveryAddressSchema,
    onSubmit: (values) => {
      const payload: IUpdateUserPayload = {
        address: values.address.trim(),
        phone: values.phone.trim(),
      };
      updateProfile.mutate(payload);
    },
  });

  Logger.warn("formik", formik.values);

  return (
    <ScrollableForm>
      <Text className="mb-4 text-sm text-secondary">
        Keep your delivery information accurate to avoid shipping delays.
      </Text>
      <LabeledInput
        label="Phone"
        keyboardType="phone-pad"
        {...getFormikTextFieldProps(formik, "phone")}
      />
      <LabeledInput
        label="Full address"
        multiline
        {...getFormikTextFieldProps(formik, "address")}
      />
      <PrimaryButton
        onPress={formik.submitForm}
        loading={updateProfile.isPending}
        disabled={!formik.isValid}
        title="Update address"
      />
    </ScrollableForm>
  );
};

export default DeliveryAddress;
