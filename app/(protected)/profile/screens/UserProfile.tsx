import ScrollableForm from "@/components/common/ScrollableForm";
import TextField from "@/components/common/TextField";
import { BodyText, PrimaryButton } from "@/components/ui";
import { useUpdateProfileMutation } from "@/hooks/useUpdateProfileMutation";
import { useAuth } from "@/providers/auth";
import { useThemedStyles } from "@/providers/theme";
import { IUpdateUserPayload } from "@/services/user/user.types";
import { getFormikTextFieldProps } from "@/utils/formik";
import { Logger } from "@/utils/logger";
import { useFormik } from "formik";
import { View } from "react-native";
import { InferType, object, string } from "yup";

const userProfileSchema = object({
  firstName: string().trim().required("First name is required"),
  lastName: string().trim().required("Last name is required"),
  phone: string().trim().required("Phone number is required"),
  bio: string().optional().nullable(),
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
  const theme = useThemedStyles();
  const updateProfile = useUpdateProfileMutation();
  const formik = useFormik<UserProfileFormValues>({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
    validationSchema: userProfileSchema,
    onSubmit: (values) => {
      const payload: IUpdateUserPayload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim(),
        bio: values.bio || "",
      };
      updateProfile.mutate(payload);
    },
  });

  Logger.warn("formik", formik.values);

  return (
    <ScrollableForm>
      <BodyText size="md" tone={theme.bodyTone} className="mb-4">
        Update your basic profile information. These details are used to
        personalize your experience.
      </BodyText>

      <View className="gap-4 mt-2">
        <TextField
          label="First name"
          placeholder="Enter First name"
          keyboardType="default"
          autoCapitalize="none"
          {...getFormikTextFieldProps(formik, "firstName")}
        />

        <TextField
          label="Last name"
          placeholder="Enter Last name"
          keyboardType="default"
          autoCapitalize="none"
          {...getFormikTextFieldProps(formik, "lastName")}
        />

        <TextField
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          disabled
          editable={false}
          {...getFormikTextFieldProps(formik, "email")}
        />

        <TextField
          label="Phone Number"
          placeholder="Enter Phone"
          keyboardType="phone-pad"
          autoCapitalize="none"
          {...getFormikTextFieldProps(formik, "phone")}
        />

        <TextField
          label="Bio"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Tell us about yourself"
          rightIconName="close-circle-outline"
          onRightIconPress={() => formik.setFieldValue("bio", "")}
          {...getFormikTextFieldProps(formik, "bio")}
        />
      </View>

      <View className="mt-6">
        <PrimaryButton
          onPress={formik.submitForm}
          loading={updateProfile.isPending}
          disabled={!formik.isValid}
          title="Save changes"
          className={`${theme.primaryButtonClass}`}
          textClassName={theme.primaryTextClassInverse}
          spinnerColor={theme.primarySpinnerColor}
        />
      </View>
    </ScrollableForm>
  );
};

export default UserProfile;
