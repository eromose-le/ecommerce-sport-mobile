import PrimaryButton from "@/components/common/PrimaryButton";
import ScrollableForm from "@/components/common/ScrollableForm";
import TextField from "@/components/common/TextField";
import { useUpdateProfileMutation } from "@/hooks/useUpdateProfileMutation";
import { useAuth } from "@/providers/auth";
import { IUpdateUserPayload } from "@/services/user/user.types";
import { getFormikTextFieldProps } from "@/utils/formik";
import { Logger } from "@/utils/logger";
import { useFormik } from "formik";
import { Text, View } from "react-native";
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

      <View className="gap-4 mt-2">
        <TextField
          label="Phone Number"
          placeholder="Enter Phone"
          keyboardType="phone-pad"
          autoCapitalize="none"
          {...getFormikTextFieldProps(formik, "phone")}
        />

        <TextField
          label="Delivery Address"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Enter delivery address"
          rightIconName="close-circle-outline"
          onRightIconPress={() => formik.setFieldValue("address", "")}
          value={formik.values.address}
          onChangeText={formik.handleChange("address")}
          onBlur={formik.handleBlur("address")}
          error={formik.touched.address ? formik.errors.address : undefined}
        />
      </View>

      <View className="mt-6">
        <PrimaryButton
          onPress={formik.submitForm}
          loading={updateProfile.isPending}
          disabled={!formik.isValid}
          title="Update address"
        />
      </View>
    </ScrollableForm>
  );
};

export default DeliveryAddress;
