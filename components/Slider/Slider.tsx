import React, { forwardRef, memo, useCallback } from "react";
import { FlatListProps } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type SliderProps = FlatListProps<any> & {
  data: any[];
  index?: number;
  onIndexChange: (index: number) => void;
  width: number;
};

const Slider = forwardRef<FlatList<any>, SliderProps>(
  ({ data, index, onIndexChange, width, ...props }, ref) => {
    const onScroll = useCallback(
      (e: { nativeEvent: { contentOffset: { x: number } } }) => {
        if (index === undefined) {
          return;
        }

        const offset = e.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offset / width);
        if (newIndex === index || newIndex > data.length - 1 || newIndex < 0) {
          return;
        }

        onIndexChange(newIndex);
      },
      [index, width, data?.length, onIndexChange],
    );

    /*
    When you get this error:
     Invariant Violation: TaskQueue: Error with task : [5753,"RCTView",1,{"width":"<<NaN>>"}] is not usable as a native method argument
     - It means that you should pass the width parameter to this component.
     */
    const getItemLayout = useCallback(
      (_: any, idx: number) => ({
        length: width,
        offset: width * idx,
        index: idx,
      }),
      [width],
    );

    return (
      data?.length > 0 && (
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
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          {...props}
        />
      )
    );
  },
);

export default memo(Slider);
