import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import AppFooterDetails from "../../components/AppFooterDetails/AppFooterDetails";
import DetailsDescriptionView from "../../components/DetailsDescriptionView/DetailsDescriptionView";
import DetailsFeaturesView from "../../components/DetailsFeaturesView/DetailsFeaturesView";
import DetailsObjectView from "../../components/DetailsObjectView/DetailsObjectView";
import DetailsReviewsView from "../../components/DetailsReviewsView/DetailsReviewsView";
import DetailsTitleView from "../../components/DetailsTitleView/DetailsTitleView";
import { FEATURES } from "../../components/ListingFeaturesView/ListingFeaturesView";
import { useBookingContext } from "../../contexts/BookingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { Routes } from "../../navigation/Routes";
import { fetchRoom } from "../../services/apiService";
import formatRange from "../../utils/rangeFormatter";

const AMENITIES_IN_VIEW = 6;
const REVIEWS_IN_VIEW = 6;

const RoomDetails = ({ navigation, route }) => {
  const roomId = route.params.roomId;

  const { setRoom } = useRoomContext();
  const { bookingState, setBookingData } = useBookingContext();
  const toast = useToast();

  const { data: roomData } = useQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => fetchRoom(roomId),
  });

  // Set room to global context
  useEffect(() => {
    setRoom(roomData);
  }, [roomData]);

  // Clear global room on unmount
  useEffect(() => {
    return () => {
      setRoom(null);
    };
  }, []);

  useEffect(() => {
    if (bookingState.startDate && bookingState.endDate) {
      setBookingData({
        highlightedDates: [bookingState.startDate, bookingState.endDate],
      });
    }
  }, [bookingState.startDate, bookingState.endDate]);

  const footerLinkOnPress = useCallback(() => {
    navigation.navigate({
      name: Routes.SELECT_DATES,
      merge: true,
    });
  }, [navigation]);

  const handleReserveButton = useCallback(() => {
    if (bookingState.startDate && bookingState.endDate) {
      navigation.navigate(Routes.GUEST_INFO);
    } else {
      toast.show("No date selected", {
        placement: "top",
        style: toastStyles.toastInsetHeader,
      });
      footerLinkOnPress();

      // Alert.alert("No date selected", "Please select a date");
    }
  }, [
    bookingState.startDate,
    bookingState.endDate,
    footerLinkOnPress,
    navigation,
    toast,
  ]);

  const footerTitle = useMemo(() => {
    if (!roomData?.category.price) {
      return "";
    }
    return `₱${roomData.category.price?.toLocaleString()}/night`;
  }, [roomData?.category.price]);

  const footerLinkLabel = useMemo(() => {
    if (!bookingState.startDate && !bookingState.endDate) {
      return "Select Date";
    }

    return formatRange(bookingState.startDate, bookingState.endDate);
  }, [bookingState.startDate, bookingState.endDate]);

  const onSeeAllReviews = useCallback(
    () =>
      navigation.push(Routes.RATINGS, {
        type: "room",
        id: roomId,
        averageRating: roomData?.average_rating,
        reviewsCount: roomData?.reviews_count,
      }),
    [navigation, roomId, roomData?.average_rating, roomData?.reviews_count],
  );

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView contentContainerStyle={globalStyles.rowGap}>
        <DetailsTitleView
          title={roomData?.category.name}
          price={roomData?.category.price}
          rating={roomData?.average_rating}
          reviewsCount={roomData?.reviews_count}
          onSeeAllReviews={onSeeAllReviews}
        />

        {/* Room Size */}
        <DetailsDescriptionView
          title="Room Size"
          description={`${roomData?.category.size} sqm`}
          emptyText="No room size."
        />

        {/* Available beds */}
        <DetailsObjectView
          title="Available beds"
          object={roomData?.category.type_of_beds}
        />

        {/* Description */}
        <DetailsDescriptionView
          title="Room Description"
          description={roomData?.description}
        />

        {/* Rules */}
        <DetailsDescriptionView
          title="Room Rules"
          description={roomData?.rules.content}
          emptyText="No room rules."
        />

        {/* Amenities */}
        <DetailsFeaturesView
          feature={FEATURES.amenities}
          data={roomData?.amenities}
          size={AMENITIES_IN_VIEW}
        />

        {/* Reviews */}
        <DetailsReviewsView
          reviews={roomData?.reviews}
          size={REVIEWS_IN_VIEW}
          onSeeAllReviews={onSeeAllReviews}
        />
      </ScrollView>

      <AppFooter>
        <AppFooterDetails
          title={footerTitle}
          buttonLinkLabel={footerLinkLabel}
          buttonLinkOnPress={footerLinkOnPress}
          buttonLabel="Reserve"
          buttonOnPress={handleReserveButton}
        />
      </AppFooter>
    </View>
  );
};

export default RoomDetails;
