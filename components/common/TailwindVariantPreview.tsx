import { useTheme, useThemedStyles } from "@/providers/theme";
import { Logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import {
  BodyText,
  Card,
  Container,
  Heading,
  Input,
  Label,
  LinkButton,
  PrimaryButton,
  Row,
  SecondaryButton,
  TextArea,
} from "../ui";

const TailwindVariantPreview = () => {
  const { theme: themeKey, setTheme } = useTheme();
  const theme = useThemedStyles();

  Logger.warn("theme -tt", themeKey, theme);

  return (
    <ScrollView
      className={`flex-1 ${theme.pageBg}`}
      contentContainerStyle={{ paddingBottom: 10 }}
    >
      <Container padding="sm" gap="md" className={theme.pageBg}>
        <Row justify="between" align="center">
          <Heading level="h1" weight="bold" tone={theme.headingTone}>
            UI Variant Gallery
          </Heading>
          <Row align="center" gap="sm">
            <BodyText tone={theme.bodyTone} weight="medium">
              Dark mode
            </BodyText>
            <Switch
              value={themeKey === "dark"}
              onValueChange={(value) => setTheme(value ? "dark" : "light")}
              trackColor={{ false: "#E5E7EB", true: "#111827" }}
              thumbColor={themeKey === "dark" ? "#F9FAFB" : "#111827"}
              ios_backgroundColor="#E5E7EB"
            />
          </Row>
        </Row>
        <BodyText tone={theme.bodyTone}>
          Quick preview of the shared UI primitives and their variants.
        </BodyText>

        {/* Buttons */}
        <Card padding="md" shadow="sm" className={`gap-3 ${theme.surface}`}>
          <Heading level="h3" tone={theme.headingTone}>
            Buttons
          </Heading>
          <BodyText tone={theme.bodyTone}>Primary</BodyText>
          <Row gap="sm" wrap>
            <PrimaryButton
              title="Primary sm"
              size="sm"
              onPress={() => {}}
              className={theme.primaryButtonClass}
              textClassName={theme.primaryTextClass}
              spinnerColor={theme.primarySpinnerColor}
            />
            <PrimaryButton
              title="Primary md"
              onPress={() => {}}
              className={theme.primaryButtonClass}
              textClassName={theme.primaryTextClass}
              spinnerColor={theme.primarySpinnerColor}
            />
            <PrimaryButton
              title="Primary lg"
              size="lg"
              onPress={() => {}}
              className={theme.primaryButtonClass}
              textClassName={theme.primaryTextClass}
              spinnerColor={theme.primarySpinnerColor}
            />
            <PrimaryButton
              title="Loading"
              loading
              onPress={() => {}}
              className={`w-40 ${theme.primaryButtonClass}`}
              textClassName={theme.primaryTextClass}
              spinnerColor={theme.primarySpinnerColor}
            />
            <PrimaryButton
              title="Disabled"
              disabled
              onPress={() => {}}
              className={theme.primaryButtonClass}
              textClassName={theme.primaryTextClass}
              spinnerColor={theme.primarySpinnerColor}
            />
          </Row>

          <BodyText tone={theme.bodyTone} className="mt-3">
            Secondary
          </BodyText>
          <Row gap="sm" wrap>
            <SecondaryButton
              title="Secondary sm"
              size="sm"
              onPress={() => {}}
              className={theme.secondaryButtonClass}
              textClassName={theme.secondaryTextClass}
              spinnerColor={theme.secondarySpinnerColor}
            />
            <SecondaryButton
              title="Secondary md"
              onPress={() => {}}
              className={theme.secondaryButtonClass}
              textClassName={theme.secondaryTextClass}
              spinnerColor={theme.secondarySpinnerColor}
            />
            <SecondaryButton
              title="Secondary lg"
              size="lg"
              onPress={() => {}}
              className={theme.secondaryButtonClass}
              textClassName={theme.secondaryTextClass}
              spinnerColor={theme.secondarySpinnerColor}
            />
            <SecondaryButton
              title="Loading"
              loading
              onPress={() => {}}
              className={`w-40 ${theme.secondaryButtonClass}`}
              textClassName={theme.secondaryTextClass}
              spinnerColor={theme.secondarySpinnerColor}
            />
            <SecondaryButton
              title="Disabled"
              disabled
              onPress={() => {}}
              className={theme.secondaryButtonClass}
              textClassName={theme.secondaryTextClass}
              spinnerColor={theme.secondarySpinnerColor}
            />
          </Row>

          <BodyText tone={theme.bodyTone} className="mt-3">
            Link
          </BodyText>
          <Row gap="sm" wrap>
            <LinkButton
              title="Plain link"
              onPress={() => {}}
              textClassName={theme.linkTextClass}
              spinnerColor={theme.linkSpinnerColor}
            />
            <LinkButton
              title="Uppercase"
              uppercase
              onPress={() => {}}
              textClassName={theme.linkTextClass}
              spinnerColor={theme.linkSpinnerColor}
            />
            <LinkButton
              title="Loading"
              loading
              onPress={() => {}}
              loadingText="Loading..."
              textClassName={theme.linkTextClass}
              spinnerColor={theme.linkSpinnerColor}
            />
            <LinkButton
              title="Disabled"
              disabled
              onPress={() => {}}
              textClassName={theme.linkTextClass}
              spinnerColor={theme.linkSpinnerColor}
            />
          </Row>
        </Card>

        {/* Typography */}
        <Card padding="md" shadow="sm" className={`gap-2 ${theme.surface}`}>
          <Heading level="h3" tone={theme.headingTone}>
            Typography
          </Heading>
          <Heading level="h1" tone={theme.headingTone}>
            Heading H1
          </Heading>
          <Heading level="h2" tone={theme.headingTone}>
            Heading H2
          </Heading>
          <Heading level="h3" tone={theme.headingTone}>
            Heading H3
          </Heading>
          <Heading level="h4" tone={theme.bodyTone}>
            Heading H4 (secondary)
          </Heading>
          <BodyText tone={theme.headingTone}>Body default</BodyText>
          <BodyText size="sm" tone={theme.bodyTone}>
            Body small secondary
          </BodyText>
          <BodyText size="lg" weight="semibold" tone={theme.headingTone}>
            Body large semibold
          </BodyText>
          <Label tone={theme.labelTone}>Label default</Label>
          <Label tone="danger" required>
            Label required
          </Label>
        </Card>

        {/* Inputs */}
        <Card padding="md" shadow="sm" className={`gap-4 ${theme.surface}`}>
          <Heading level="h3" tone={theme.headingTone}>
            Inputs
          </Heading>
          <Input
            label="Default"
            placeholder="Type here"
            labelTone={
              theme.labelTone === "muted" ? "secondary" : theme.labelTone
            }
            inputClassName={theme.inputClassName}
            placeholderTextColor={theme.placeholderColor}
          />
          <Input
            label="With icons"
            placeholder="you@example.com"
            labelTone={
              theme.labelTone === "muted" ? "secondary" : theme.labelTone
            }
            inputClassName={theme.inputClassName}
            placeholderTextColor={theme.placeholderColor}
            leftElement={
              <Ionicons name="mail-outline" size={16} color={theme.iconMuted} />
            }
            rightElement={
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.successIcon}
              />
            }
          />
          <Input
            label="Error state"
            placeholder="Something is wrong"
            error="Helper text for an error"
            labelTone={
              theme.labelTone === "muted" ? "secondary" : theme.labelTone
            }
            inputClassName={theme.inputClassName}
            placeholderTextColor={theme.placeholderColor}
          />
          <Input
            label="Disabled"
            value="Disabled value"
            editable={false}
            helperText="Read only"
            labelTone={
              theme.labelTone === "muted" ? "secondary" : theme.labelTone
            }
            inputClassName={theme.inputClassName}
            placeholderTextColor={theme.placeholderColor}
          />
          <TextArea
            label="Text area"
            placeholder="Multi-line entry"
            helperText="Helper text"
            numberOfLines={4}
            labelTone={
              theme.labelTone === "muted" ? "secondary" : theme.labelTone
            }
            inputClassName={theme.inputClassName}
            placeholderTextColor={theme.placeholderColor}
          />
        </Card>

        {/* Layout */}
        <Card padding="md" shadow="sm" className={`gap-4 ${theme.surface}`}>
          <Heading level="h3" tone={theme.headingTone}>
            Layout
          </Heading>
          <Container
            padding="sm"
            background="muted"
            rounded="lg"
            gap="sm"
            border="subtle"
            className={theme.mutedSurface}
          >
            <BodyText tone={theme.headingTone}>
              Container with padding/border/background.
            </BodyText>
            <Row gap="sm">
              <PrimaryButton
                title="Action"
                size="sm"
                onPress={() => {}}
                className={theme.primaryButtonClass}
                textClassName={theme.primaryTextClass}
                spinnerColor={theme.primarySpinnerColor}
              />
              <SecondaryButton
                title="Ghost"
                size="sm"
                onPress={() => {}}
                className={theme.secondaryButtonClass}
                textClassName={theme.secondaryTextClass}
                spinnerColor={theme.secondarySpinnerColor}
              />
            </Row>
          </Container>

          <Card padding="sm" shadow="md" className={`gap-2 ${theme.surface}`}>
            <Heading level="h4" tone={theme.headingTone}>
              Nested Card
            </Heading>
            <BodyText tone={theme.bodyTone}>
              Card variant showing border + shadow.
            </BodyText>
            <Row gap="sm" justify="between">
              <Label tone={theme.labelTone}>Row left</Label>
              <Label tone={theme.bodyTone}>Row right</Label>
            </Row>
          </Card>
        </Card>

        {/* Native Text fallback to show baseline */}
        <View className="mt-2">
          <Text
            className={`text-xs font-jost ${themeKey === "dark" ? "text-gray-400" : "text-secondary"}`}
          >
            Tailwind-variants preview ends.
          </Text>
        </View>
      </Container>
    </ScrollView>
  );
};

export default TailwindVariantPreview;
