import React, { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
} from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;

type ToastAnimateProps = {
  children: React.ReactNode;
  onDismiss?: () => void; // called when toast is swiped away
};

export const ToastAnimate: React.FC<ToastAnimateProps> = ({
  children,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(50)).current; // slide in from bottom
  const translateX = useRef(new Animated.Value(0)).current; // swipe left/right
  const opacity = useRef(new Animated.Value(0)).current; // fade in/out

  // Slide + fade in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gesture handler
  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    translateX.setValue(event.nativeEvent.translationX);
  };

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    const { state, translationX } = event.nativeEvent;

    if (state === State.END || state === State.CANCELLED) {
      const absX = Math.abs(translationX);
      const direction = translationX > 0 ? 1 : -1;

      // if swiped far enough, dismiss
      if (absX > SCREEN_WIDTH * 0.3) {
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: direction * SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onDismiss?.();
        });
      } else {
        // return to center
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={{
          transform: [{ translateY }, { translateX }],
          opacity,
          width: "100%",
          alignItems: "center",
        }}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};
