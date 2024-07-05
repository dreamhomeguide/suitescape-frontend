import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import StarRating from "react-native-star-rating-widget";

import style from "./FeedbackAppStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import FormInput from "../../components/FormInput/FormInput";

const FeedbackApp = () => {
  const [rating, setRating] = useState(0);

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView
        contentContainerStyle={style.mainContainer}
        scrollEnabled={false}
      >
        <View style={style.rateContainer}>
          <Text style={style.headerText}>Please Rate Your Experience</Text>
          <StarRating
            rating={rating}
            onChange={(rating) => {
              Haptics.selectionAsync();
              setRating(rating);
            }}
            starSize={50}
            // animationConfig={{ scale: 1.1 }}
            starStyle={style.starRating}
            style={style.starRatingContainer}
          />
        </View>

        <View>
          <FormInput
            type="textarea"
            label="Write Feedback"
            labelStyle={style.headerText}
            placeholder="Tell us on how we can improve…"
          />
        </View>
      </ScrollView>

      <AppFooter>
        <ButtonLarge>Send Feedback</ButtonLarge>
      </AppFooter>
    </View>
  );
};

export default FeedbackApp;
