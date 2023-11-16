import { Gesture } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const useGestures = () => {
  const isGestureEnabled = useSharedValue(false);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const oldTranslationX = useSharedValue(0);
  const oldTranslationY = useSharedValue(0);

  const scale = useSharedValue(1);
  const oldScale = useSharedValue(1);

  // const reset = useWorkletCallback(() => {
  //   translationX.value = 0;
  //   translationY.value = 0;
  //   oldTranslationX.value = 0;
  //   oldTranslationY.value = 0;
  //   scale.value = 1;
  //   oldScale.value = 1;
  // });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translationX.value = oldTranslationX.value + event.translationX;
      translationY.value = oldTranslationY.value + event.translationY;
    })
    .onEnd(() => {
      oldTranslationX.value = translationX.value;
      oldTranslationY.value = translationY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      isGestureEnabled.value = true;
    })
    .onUpdate((event) => {
      scale.value = oldScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1, { duration: 300 }, () => {
          oldScale.value = 1;
          isGestureEnabled.value = false;
        });
      } else {
        oldScale.value = scale.value;
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  });

  const pinchAndPanGesture = Gesture.Race(
    Gesture.Simultaneous(pinchGesture, panGesture),
  );

  return {
    isGestureEnabled,
    panGesture,
    pinchGesture,
    pinchAndPanGesture,
    animatedStyle,
  };
};

export default useGestures;
