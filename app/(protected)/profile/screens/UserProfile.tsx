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

const userProfileSchema = object({
  firstName: string().trim().required("First name is required"),
  lastName: string().trim().required("Last name is required"),
  phone: string().trim().required("Phone number is required"),
  address: string().trim().required("Address is required"),
  email: string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .nullable()
    .transform((value) => (value === "" ? undefined : value)),
});

type UserProfileFormValues = InferType<typeof userProfileSchema>;

const UserProfile = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfileMutation();
  const formik = useFormik<UserProfileFormValues>({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
    validationSchema: userProfileSchema,
    onSubmit: (values) => {
      const payload: IUpdateUserPayload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
      };
      updateProfile.mutate(payload);
    },
  });

  Logger.warn("formik", formik.values);

  return (
    <ScrollableForm>
      <Text className="mb-4 text-sm text-secondary">
        Update your basic profile information. These details are used to
        personalize your experience.
      </Text>
      <LabeledInput
        label="First name"
        {...getFormikTextFieldProps(formik, "firstName")}
      />
      <LabeledInput
        label="Last name"
        {...getFormikTextFieldProps(formik, "lastName")}
      />
      <LabeledInput
        label="Email"
        disabled
        {...getFormikTextFieldProps(formik, "email")}
      />
      <LabeledInput
        label="Phone"
        keyboardType="phone-pad"
        {...getFormikTextFieldProps(formik, "phone")}
      />
      <LabeledInput
        label="Address"
        multiline
        {...getFormikTextFieldProps(formik, "address")}
      />
      <PrimaryButton
        onPress={formik.submitForm}
        loading={updateProfile.isPending}
        disabled={!formik.isValid}
        title="Save changes"
      />
    </ScrollableForm>
  );
};

export default UserProfile;
