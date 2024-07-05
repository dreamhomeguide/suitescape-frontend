import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useReducer, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import StarRating from "react-native-star-rating-widget";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import SummaryListingView from "../../components/SummaryListingView/SummaryListingView";
import { Routes } from "../../navigation/Routes";
import {
  createReview,
  fetchBooking,
  updateBookingStatus,
} from "../../services/apiService";
import { handleApiError } from "../../utils/apiHelpers";
import reducerSetter from "../../utils/reducerSetter";
import selectBookingData from "../../utils/selectBookingData";

const ratingLabels = {
  cleanliness: "Cleanliness",
  price_affordability: "Price Affordability",
  facility_service: "Facility & Service",
  comfortability: "Comfortability",
  staff: "Staff",
  location: "Location",
  privacy_and_security: "Privacy & Security",
  accessibility: "Accessibility",
};

const initialState = Object.keys(ratingLabels).reduce((acc, state) => {
  acc[state] = 0;
  return acc;
}, {});

const RateExperience = ({ navigation, route }) => {
  const [state, setRatingData] = useReducer(
    reducerSetter,
    initialState,
    undefined,
  );
  const [overallRating, setOverallRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const scrollViewRef = useRef(null);

  const queryClient = useQueryClient();

  const bookingId = route.params.bookingId;

  const { data: booking, isFetching: isFetchingBooking } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => fetchBooking(bookingId),
    select: selectBookingData,
  });

  const rateExperienceMutation = useMutation({
    mutationFn: (data) => {
      createReview(data).then(() =>
        updateBookingStatus({ bookingId, status: "completed" }),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["bookings", "user"],
        exact: true,
      });

      navigation.navigate(Routes.FEEDBACK, {
        type: "success",
        title: "Congratulations",
        subtitle: "Booking rated successfully",
        screenToNavigate: {
          name: Routes.BOOKINGS,
          params: { tab: "Completed" },
        },
      });
    },
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const handleRateExperience = useCallback(() => {
    if (!rateExperienceMutation.isPending) {
      rateExperienceMutation.mutate({
        listingId: booking.listing.id,
        feedback,
        overallRating,
        serviceRatings: state,
      });
    }
  }, [
    booking?.listing.id,
    feedback,
    overallRating,
    state,
    rateExperienceMutation.isPending,
  ]);

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView ref={scrollViewRef}>
        <View style={globalStyles.rowGapSmall}>
          <SummaryListingView
            listing={booking?.listing}
            coverImageUrl={booking?.coverImage.url}
          />

          <View style={globalStyles.rowGap}>
            <View style={{ rowGap: 15, ...style.container }}>
              {Object.entries(ratingLabels).map(([key, label]) => (
                <View key={key} style={style.detailsRow}>
                  <View style={{ width: "35%" }}>
                    <Text>{label}</Text>
                  </View>
                  <View style={style.detailsRow}>
                    <StarRating
                      rating={state[key]}
                      onChange={(rating) => setRatingData({ [key]: rating })}
                      starSize={30}
                      starStyle={style.starRating}
                    />

                    <Text style={globalStyles.flexFull}>{state[key]}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={style.container}>
              <View style={style.detailsRow}>
                <View style={style.detailsRow}>
                  <View style={{ width: "35%" }}>
                    <Text>Overall Experience</Text>
                  </View>

                  <StarRating
                    rating={overallRating}
                    onChange={(rating) => setOverallRating(rating)}
                    starSize={30}
                    starStyle={style.starRating}
                  />

                  <Text style={globalStyles.flexFull}>{overallRating}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={style.container}>
          <Text style={style.headerText}>Feedback</Text>

          <FormInput
            type="textarea"
            value={feedback}
            onChangeText={setFeedback}
            maxLength={255}
            // containerStyle={style.messageContainer}
            placeholder="Share your thoughts on the stay..."
            blurOnSubmit
            returnKeyType="done"
            onFocus={() =>
              setTimeout(() => scrollViewRef.current.scrollToEnd(), 300)
            }
          />
        </View>
      </ScrollView>

      <AppFooter>
        <ButtonLarge onPress={handleRateExperience}>Submit</ButtonLarge>
      </AppFooter>

      <DialogLoading visible={isFetchingBooking} />
    </View>
  );
};

export default RateExperience;
