import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Container padding="sm" gap="md" className="bg-background">
        <Heading level="h1" weight="bold">
          UI Variant Gallery
        </Heading>
        <BodyText tone="secondary">
          Quick preview of the shared UI primitives and their variants.
        </BodyText>

        {/* Buttons */}
        <Card padding="md" shadow="sm" className="gap-3">
          <Heading level="h3">Buttons</Heading>
          <BodyText tone="secondary">Primary</BodyText>
          <Row gap="sm" wrap>
            <PrimaryButton title="Primary sm" size="sm" onPress={() => {}} />
            <PrimaryButton title="Primary md" onPress={() => {}} />
            <PrimaryButton title="Primary lg" size="lg" onPress={() => {}} />
            <PrimaryButton
              title="Loading"
              loading
              onPress={() => {}}
              className="w-40"
            />
            <PrimaryButton title="Disabled" disabled onPress={() => {}} />
          </Row>

          <BodyText tone="secondary" className="mt-3">
            Secondary
          </BodyText>
          <Row gap="sm" wrap>
            <SecondaryButton title="Secondary sm" size="sm" onPress={() => {}} />
            <SecondaryButton title="Secondary md" onPress={() => {}} />
            <SecondaryButton title="Secondary lg" size="lg" onPress={() => {}} />
            <SecondaryButton
              title="Loading"
              loading
              onPress={() => {}}
              className="w-40"
            />
            <SecondaryButton
              title="Disabled"
              disabled
              onPress={() => {}}
            />
          </Row>

          <BodyText tone="secondary" className="mt-3">
            Link
          </BodyText>
          <Row gap="sm" wrap>
            <LinkButton title="Plain link" onPress={() => {}} />
            <LinkButton title="Uppercase" uppercase onPress={() => {}} />
            <LinkButton
              title="Loading"
              loading
              onPress={() => {}}
              loadingText="Loading..."
            />
            <LinkButton title="Disabled" disabled onPress={() => {}} />
          </Row>
        </Card>

        {/* Typography */}
        <Card padding="md" shadow="sm" className="gap-2">
          <Heading level="h3">Typography</Heading>
          <Heading level="h1">Heading H1</Heading>
          <Heading level="h2">Heading H2</Heading>
          <Heading level="h3">Heading H3</Heading>
          <Heading level="h4" tone="secondary">
            Heading H4 (secondary)
          </Heading>
          <BodyText>Body default</BodyText>
          <BodyText size="sm" tone="secondary">
            Body small secondary
          </BodyText>
          <BodyText size="lg" weight="semibold">
            Body large semibold
          </BodyText>
          <Label>Label default</Label>
          <Label tone="danger" required>
            Label required
          </Label>
        </Card>

        {/* Inputs */}
        <Card padding="md" shadow="sm" className="gap-4">
          <Heading level="h3">Inputs</Heading>
          <Input label="Default" placeholder="Type here" />
          <Input
            label="With icons"
            placeholder="you@example.com"
            leftElement={<Ionicons name="mail-outline" size={16} color="#6B7280" />}
            rightElement={<Ionicons name="checkmark-circle" size={16} color="#10B981" />}
          />
          <Input
            label="Error state"
            placeholder="Something is wrong"
            error="Helper text for an error"
          />
          <Input
            label="Disabled"
            value="Disabled value"
            editable={false}
            helperText="Read only"
          />
          <TextArea
            label="Text area"
            placeholder="Multi-line entry"
            helperText="Helper text"
            numberOfLines={4}
          />
        </Card>

        {/* Layout */}
        <Card padding="md" shadow="sm" className="gap-4">
          <Heading level="h3">Layout</Heading>
          <Container
            padding="sm"
            background="muted"
            rounded="lg"
            gap="sm"
            border="subtle"
          >
            <BodyText>Container with padding/border/background.</BodyText>
            <Row gap="sm">
              <PrimaryButton title="Action" size="sm" onPress={() => {}} />
              <SecondaryButton title="Ghost" size="sm" onPress={() => {}} />
            </Row>
          </Container>

          <Card padding="sm" shadow="md" className="gap-2">
            <Heading level="h4">Nested Card</Heading>
            <BodyText tone="secondary">
              Card variant showing border + shadow.
            </BodyText>
            <Row gap="sm" justify="between">
              <Label>Row left</Label>
              <Label tone="secondary">Row right</Label>
            </Row>
          </Card>
        </Card>

        {/* Native Text fallback to show baseline */}
        <View className="mt-2">
          <Text className="text-xs text-secondary font-jost">
            Tailwind-variants preview ends.
          </Text>
        </View>
      </Container>
    </ScrollView>
  );
};

export default TailwindVariantPreview;
