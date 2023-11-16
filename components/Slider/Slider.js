import React, { forwardRef, memo } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

const Slider = forwardRef(
  ({ data, index, onIndexChange, width, ...props }, ref) => {
    const onScroll = (e) => {
      if (index === undefined) {
        return;
      }

      const offset = e.nativeEvent.contentOffset.x;
      const newIndex = Math.round(offset / width);
      if (newIndex === index || newIndex > data.length - 1 || newIndex < 0) {
        return;
      }

      onIndexChange(newIndex);
    };

    /*
    When you get this error:
     Invariant Violation: TaskQueue: Error with task : [5753,"RCTView",1,{"width":"<<NaN>>"}] is not usable as a native method argument
     - It means that you should pass the width parameter to this component.
     */
    const getItemLayout = (_, idx) => ({
      length: width,
      offset: width * idx,
      index: idx,
    });

    return (
      data?.length > 0 && (
        // TODO: Setup gestures for image gallery
        <GestureHandlerRootView>
          <FlatList
            ref={ref}
            data={data}
            initialScrollIndex={index}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            snapToAlignment="center"
            decelerationRate="fast"
            disableIntervalMomentum
            bounces={false}
            onScroll={onScroll}
            getItemLayout={getItemLayout}
            {...props}
          />
        </GestureHandlerRootView>
      )
    );
  },
);

export default memo(Slider);
