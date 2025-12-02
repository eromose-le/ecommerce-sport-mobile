import PasswordField from "@/components/common/PasswordField";
import { BodyText, Heading, PrimaryButton } from "@/components/ui";
import { useAppLock } from "@/hooks/useAppLock";
import { useThemedStyles } from "@/providers/theme";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

const AppLockScreen = () => {
  const {
    biometricsAvailable,
    biometricLabel,
    unlockWithBiometrics,
    unlockWithPasscode,
    settings,
  } = useAppLock();
  const theme = useThemedStyles();

  const [passcode, setPasscode] = useState("");
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBiometricUnlock = async () => {
    setError(null);
    setBiometricLoading(true);
    const success = await unlockWithBiometrics();
    setBiometricLoading(false);

    if (!success) {
      setError(
        "We could not verify your biometrics. Try again or use your passcode."
      );
    }
  };

  const handlePasscodeUnlock = () => {
    setError(null);
    const success = unlockWithPasscode(passcode);
    if (!success) {
      setError("Incorrect passcode. Try again.");
      setPasscode("");
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${theme.pageBg}`}>
      <View className="flex-1 justify-center px-6">
        <View
          className={`p-6 rounded-3xl border shadow-sm ${theme.surface} ${theme.primaryBorderColor}`}
        >
          <Heading
            level="h2"
            weight="bold"
            align="center"
            tone={theme.headingTone}
          >
            Unlock Sporty Galaxy
          </Heading>
          <BodyText align="center" tone={theme.labelTone} className="mt-2">
            Use {biometricsAvailable ? biometricLabel : "your passcode"} to
            continue.
          </BodyText>

          {biometricsAvailable && (
            <View className="mt-6">
              <PrimaryButton
                title={`Use ${biometricLabel}`}
                onPress={handleBiometricUnlock}
                loading={biometricLoading}
                textClassName={theme.primaryTextClassInverse}
                spinnerColor={theme.primarySpinnerColor}
              />
            </View>
          )}

          {settings.passcodeEnabled && (
            <View className="mt-6">
              <PasswordField
                label="App passcode"
                placeholder="Enter your passcode"
                keyboardType="number-pad"
                value={passcode}
                onChangeText={(text) => setPasscode(text)}
                onSubmitEditing={handlePasscodeUnlock}
                maxLength={12}
              />
              <PrimaryButton
                title="Unlock with passcode"
                onPress={handlePasscodeUnlock}
                disabled={!passcode}
                className="mt-3"
                textClassName={theme.primaryTextClassInverse}
                spinnerColor={theme.primarySpinnerColor}
              />
            </View>
          )}

          {error && (
            <BodyText tone="danger" align="center" className="mt-4">
              {error}
            </BodyText>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppLockScreen;
