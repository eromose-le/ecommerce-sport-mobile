import { ImageSourcePropType } from "react-native";

export const exImageLink = (name: string, size?: number) =>
  `https://ui-avatars.com/api/?name=${name}&background=random&size=${
    size || 128
  }`;

const UPLOADTHING_HOST = "utfs.io";
const DEFAULT_PLACEHOLDER = exImageLink("SG");

export const normalizeUploadthingUrl = (
  url?: string | null
): string | undefined => {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes(UPLOADTHING_HOST)) {
      return url;
    }

    if (parsed.pathname.startsWith("/f/")) {
      return url;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    const fileKey = segments.pop();
    if (!fileKey) {
      return url;
    }

    return `${parsed.protocol}//${parsed.hostname}/f/${fileKey}`;
  } catch {
    const parts = url.split("/").filter(Boolean);
    const fileKey = parts.pop();

    if (fileKey) {
      return `https://${UPLOADTHING_HOST}/f/${fileKey}`;
    }
    return url;
  }
};

export const resolveImageSource = (
  source?: ImageSourcePropType | string | null,
  fallback: string = DEFAULT_PLACEHOLDER
): ImageSourcePropType => {
  if (!source) {
    return { uri: fallback };
  }

  if (typeof source === "string") {
    return { uri: normalizeUploadthingUrl(source) ?? fallback };
  }

  return source;
};
