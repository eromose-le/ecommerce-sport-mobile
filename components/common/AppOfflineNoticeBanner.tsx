import { useNetInfo } from "@react-native-community/netinfo";
import Feather from "@expo/vector-icons/Feather";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AnimatedText from "./AnimatedText";

const DOT_INDICES = [0, 1, 2, 3, 4, 5];
const BANNER_HEIGHT = 96;
const HIDE_OFFSET = BANNER_HEIGHT + 32;

function AppOfflineNoticeBanner() {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-HIDE_OFFSET)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const isOffline = useMemo(() => {
    if (netInfo.type === "unknown") return false;
    if (netInfo.type === "none") return true;
    if (netInfo.isConnected === false) return true;
    if (netInfo.isInternetReachable === false) return true;
    return false;
  }, [netInfo.isConnected, netInfo.isInternetReachable, netInfo.type]);

  const startPulse = useCallback(() => {
    if (!pulseLoop.current) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      );
    }

    pulseLoop.current?.start();
  }, [pulseAnim]);

  useEffect(() => {
    if (isOffline) {
      setVisible(true);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();

      startPulse();
    } else if (visible) {
      pulseLoop.current?.stop();
      pulseAnim.stopAnimation(() => {
        pulseAnim.setValue(1);
      });

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -HIDE_OFFSET,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setVisible(false);
        }
      });
    }
  }, [isOffline, opacityAnim, pulseAnim, slideAnim, startPulse, visible]);

  useEffect(() => {
    return () => {
      pulseLoop.current?.stop();
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          top: insets.top + 10,
          transform: [{ translateY: slideAnim }, { scale: pulseAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Gradient Background Effect */}
      <View style={styles.gradientContainer}>
        <View style={styles.gradientOverlay} />

        {/* Animated Dots Pattern */}
        <View style={styles.dotsPattern}>
          {DOT_INDICES.map((index) => (
            <AnimatedDot key={index} delay={index * 200} />
          ))}
        </View>

        {/* WiFi Icon */}
        <View style={styles.iconContainer}>
          <Feather name="wifi-off" size={24} color="white" />
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <AnimatedText
            text="No Internet Connection"
            textColor="#ffffff"
            fontSize={16}
          />
          <AnimatedText
            text="Please check your network settings"
            textColor="#ffffff"
            fontSize={12}
          />
        </View>

        {/* Animated Border */}
        <View style={styles.animatedBorder} />
      </View>
    </Animated.View>
  );
}

// Animated Dot Component
function AnimatedDot({ delay }: { delay: number }) {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animate.start();

    return () => animate.stop();
  }, [delay, fadeAnim]);

  return <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 10,
  },
  gradientContainer: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    overflow: "hidden",
    minHeight: BANNER_HEIGHT,
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 59, 48, 0.85)", // Red overlay
    borderRadius: 20,
  },
  dotsPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    margin: 2,
  },
  iconContainer: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 2,
  },
  contentContainer: {
    paddingLeft: 60,
    paddingRight: 20,
    paddingVertical: 16,
    alignItems: "flex-start",
    zIndex: 2,
  },
  animatedBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    opacity: 0.8,
  },
});

export default AppOfflineNoticeBanner;
