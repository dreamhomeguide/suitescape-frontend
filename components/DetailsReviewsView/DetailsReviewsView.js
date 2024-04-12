import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/detailsStyles";
import ButtonIconRow from "../ButtonIconRow/ButtonIconRow";
import SliderReviews from "../SliderReviews/SliderReviews";

const DetailsReviewsView = ({ reviews, onSeeAllReviews, size }) => {
  return (
    <View style={{ backgroundColor: "white" }}>
      <View style={style.subHeaderContainer}>
        <Text style={style.headerText}>Reviews</Text>

        {reviews?.length > size && (
          <View style={style.rightSeeAllContainer}>
            <ButtonIconRow
              gap={1}
              textStyle={style.seeAllText}
              label="See All"
              onPress={onSeeAllReviews}
            >
              <Ionicons name="chevron-forward" size={21} color={Colors.blue} />
            </ButtonIconRow>
          </View>
        )}
      </View>

      <SliderReviews reviews={reviews} size={size} />
    </View>
  );
};

export default memo(DetailsReviewsView);
