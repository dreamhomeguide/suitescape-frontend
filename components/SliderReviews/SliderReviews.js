import React, { memo, useCallback, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";

import style from "./SliderReviewsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import DotsView from "../DotsView/DotsView";
import Slider from "../Slider/Slider";
import SliderReviewItem from "../SliderReviewItem/SliderReviewItem";

const SliderReviews = ({ reviews, size = 5 }) => {
  const [index, setIndex] = useState(0);

  const { width } = useWindowDimensions();

  const itemWidth = width - 120;
  const itemMargin = 15;
  const slideItemWidth = itemWidth + itemMargin;
  const data = reviews?.slice(0, size);

  const renderItem = useCallback(
    ({ item }) => (
      <SliderReviewItem
        item={item}
        itemWidth={itemWidth}
        itemMargin={itemMargin}
      />
    ),
    [],
  );

  if (!reviews || reviews.length === 0) {
    return <Text style={globalStyles.emptyText}>No reviews yet.</Text>;
  }

  return (
    <View style={style.container}>
      <Slider
        index={index}
        onIndexChange={setIndex}
        data={data}
        keyExtractor={(_, id) => id.toString()}
        contentContainerStyle={style.contentContainer}
        renderItem={renderItem}
        width={slideItemWidth}
        snapToInterval={slideItemWidth}
        bounces
      />

      {data?.length > 1 && (
        <DotsView
          dotSize={9}
          index={index}
          length={data.length}
          containerStyle={style.dotsContainer}
        />
      )}
    </View>
  );
};

export default memo(SliderReviews);
