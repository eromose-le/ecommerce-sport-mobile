import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View, ViewProps } from "react-native";

interface AnimatedTextProps extends ViewProps {
  text: string;
  penColor?: string;
  textColor?: string;
  fontSize?: number;
  toggle?: boolean;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  textAlign?: "left" | "center" | "right";
  delay?: number;
}

function AnimatedText({
  text,
  penColor,
  textColor = "#333333",
  fontSize = 14,
  fontWeight = "500",
  textAlign = "left",
  toggle = false,
  delay = 0,
  ...others
}: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const cursorColor = penColor || textColor;

  useEffect(() => {
    let isMounted = true;
    let typingInterval: ReturnType<typeof setInterval> | undefined;
    const ENTRANCE_DURATION = 300;
    const TYPING_SPEED = 45;

    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    setCurrentIndex(0);
    setIsComplete(false);

    const entranceTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ENTRANCE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: ENTRANCE_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    const typingTimer = setTimeout(() => {
      if (text.length === 0) {
        if (isMounted) {
          setIsComplete(true);
        }
        return;
      }

      typingInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= text.length) {
            if (typingInterval) {
              clearInterval(typingInterval);
              typingInterval = undefined;
            }
            if (isMounted) {
              setIsComplete(true);
            }
            return text.length;
          }

          return nextIndex;
        });
      }, TYPING_SPEED);
    }, delay + ENTRANCE_DURATION);

    return () => {
      isMounted = false;
      clearTimeout(entranceTimer);
      clearTimeout(typingTimer);
      if (typingInterval) {
        clearInterval(typingInterval);
      }
    };
  }, [text, delay, fadeAnim, scaleAnim, toggle]);

  useEffect(() => {
    // Keep current index in sync when text length shrinks
    setCurrentIndex((prevIndex) => Math.min(prevIndex, text.length));
  }, [text]);

  const displayText = text.slice(0, currentIndex);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      {...others}
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: fontSize,
              fontWeight: fontWeight,
              textAlign: textAlign,
              lineHeight: fontSize * 1.4,
            },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {displayText}
        </Text>

        {/* Typing Cursor */}
        {!isComplete && <TypingCursor color={cursorColor} />}
      </View>
    </Animated.View>
  );
}

// Typing Cursor Component
function TypingCursor({ color }: { color: string }) {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();

    return () => blink.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.cursor,
        {
          backgroundColor: color,
          opacity: blinkAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 2,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  text: {
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  cursor: {
    width: 2,
    height: 16,
    marginLeft: 2,
    borderRadius: 1,
  },
});

export default AnimatedText;
