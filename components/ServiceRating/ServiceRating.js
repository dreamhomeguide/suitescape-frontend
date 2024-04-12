import { Slider } from "@miblanchard/react-native-slider";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./ServiceRatingStyles";
import capitalizedText from "../../utils/textCapitalizer";
import splitTextSpaced from "../../utils/textSplitSpacer";

const ServiceRating = ({ label, rating }) => {
  return (
    <View style={style.container} pointerEvents="none">
      <Text style={style.labelText}>
        {capitalizedText(splitTextSpaced(label), true)}
      </Text>

      <Slider
        value={rating}
        renderThumbComponent={() => null}
        maximumValue={5}
        minimumValue={1}
        disabled
        containerStyle={style.sliderContainer}
        trackStyle={style.track}
        maximumTrackStyle={style.maxTrack}
        minimumTrackStyle={style.minTrack(rating)}
      />

      <Text style={style.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

export default memo(ServiceRating);
