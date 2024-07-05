import { Image } from "expo-image";
import React, { memo, useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import {
  BorderlessButton,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import style from "./FloatingIconStyles";
import Fontello from "../../assets/fontello/Fontello";

const DEFAULT_ANIM_CONFIG = {
  duration: 1200,
  restDisplacementThreshold: 150,
  restSpeedThreshold: 150,
};

const FloatingIcon = ({
  imageSize = 70,
  imageSource,
  children,
  onPress,
  onClose,
  containerStyle,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const { height } = useWindowDimensions();

  const floatingStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  const composedGestures = useMemo(() => {
    const drag = Gesture.Pan()
      .shouldCancelWhenOutside(true)
      .onChange((event) => {
        translateX.value += event.changeX;
        translateY.value += event.changeY;
      })
      .onFinalize(() => {
        translateX.value = withSpring(0, DEFAULT_ANIM_CONFIG);

        // If the icon is far from the top, it will go back to the starting position
        if (translateY.value < 0) {
          translateY.value = withSpring(0, DEFAULT_ANIM_CONFIG);
        }

        // If the icon is far from the bottom, it will go to the maximum position
        if (translateY.value > height / 2 - 50) {
          translateY.value = withSpring(height / 2 - 50, DEFAULT_ANIM_CONFIG);
        }
      });

    const tap = Gesture.Tap()
      .enabled(!!onPress)
      .onStart(() => {
        opacity.value = 0.5;
      })
      .onEnd(() => {
        opacity.value = withTiming(1);
        runOnJS(onPress)();
      });

    return Gesture.Race(drag, tap);
  }, [height, onPress]);

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View style={[floatingStyles, containerStyle]}>
        <View pointerEvents="none">
          {children || (
            <Image source={imageSource} style={style.image(imageSize)} />
          )}
        </View>

        <BorderlessButton
          onPress={onClose}
          disallowInterruption
          style={style.closeButtonContainer}
        >
          <View style={style.closeButton}>
            <Fontello name="x-regular" size={5} color="white" />
          </View>
        </BorderlessButton>
      </Animated.View>
    </GestureDetector>
  );
};

export default memo(FloatingIcon);
