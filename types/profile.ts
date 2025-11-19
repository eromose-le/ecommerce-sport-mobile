import { SCREEN_LABELS } from "@/components/profile/profile-constants";
import { Ionicons } from "@expo/vector-icons";

export type ScreenKey = keyof typeof SCREEN_LABELS;

export type ScreenComponentProps = {
  screenKey: ScreenKey;
};

export type IoniconName = keyof typeof Ionicons.glyphMap;

export type ProfileLink = {
  key: string;
  label: string;
  icon: IoniconName;
  onPress?: () => void;
};
