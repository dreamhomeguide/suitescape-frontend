import React, { memo } from "react";
import { Pressable, View } from "react-native";

import style from "./DotsViewStyles";

const DotsView = ({
  index,
  length,
  dotSize = 15,
  onDotClicked,
  containerStyle,
}) => {
  const renderDots = () => {
    const dots = [];

    for (let i = 0; i < length; i++) {
      dots.push(
        <Pressable
          key={i}
          hitSlop={20}
          onPress={() => onDotClicked && onDotClicked(i)}
          style={style.dot(dotSize, i === index)}
        />,
      );
    }

    return dots;
  };

  return (
    <View style={{ ...style.dotContainer, ...containerStyle }}>
      {renderDots()}
    </View>
  );
};

export default memo(DotsView);
