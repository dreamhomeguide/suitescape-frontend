import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import AppFooterDetails from "../../components/AppFooterDetails/AppFooterDetails";
import AppHeader from "../../components/AppHeader/AppHeader";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import DetailsTitleView from "../../components/DetailsTitleView/DetailsTitleView";
import ListingFeaturesView, {
  FEATURES,
} from "../../components/ListingFeaturesView/ListingFeaturesView";
import ReadMore from "../../components/ReadMore/ReadMore";
import SliderReviews from "../../components/SliderReviews/SliderReviews";
import { useBookingContext } from "../../contexts/BookingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import useFetchAPI from "../../hooks/useFetchAPI";
import { Routes } from "../../navigation/Routes";

const AMENITIES_IN_VIEW = 6;
const REVIEWS_IN_VIEW = 6;

const RoomDetails = ({ navigation, route }) => {
  const roomId = route.params.roomId;

  const { bookingState, clearDates } = useBookingContext();
  const startDate = new Date(bookingState.startDate);
  const endDate = new Date(bookingState.endDate);

  const { data: roomData } = useFetchAPI(`/rooms/${roomId}`);
  const { setRoom } = useRoomContext();
  const toast = useToast();

  const footerTitle = roomData?.category.price
    ? `₱${roomData.category.price}/night`
    : "";

  const footerLinkLabel = () => {
    if (!bookingState.startDate && !bookingState.endDate) {
      return "Date";
    }

    let year = ", yyyy";
    if (new Date().getFullYear() === endDate.getFullYear()) {
      year = "";
    }

    if (bookingState.startDate === bookingState.endDate) {
      return format(startDate, "MMM d" + year);
    }

    if (startDate.getMonth() === endDate.getMonth()) {
      return format(startDate, "MMM d") + " - " + format(endDate, "d" + year);
    }

    return format(startDate, "MMM d") + " - " + format(endDate, "MMM d" + year);
  };

  const footerLinkOnPress = () =>
    navigation.navigate({ name: Routes.SELECT_DATES, merge: true });

  // Set room to global context
  useEffect(() => {
    setRoom(roomData);
  }, [roomData]);

  // Clear global room and dates on unmount
  useEffect(() => {
    return () => {
      clearDates();
      setRoom(null);
    };
  }, []);

  const handleReserveButton = () => {
    if (bookingState.startDate && bookingState.endDate) {
      navigation.navigate(Routes.GUEST_INFO);
    } else {
      toast.show("No date selected", {
        placement: "top",
        style: toastStyles.toastInsetHeader,
      });

      navigation.navigate({
        name: Routes.SELECT_DATES,
        merge: true,
      });

      // Alert.alert("No date selected", "Please select a date");
    }
  };

  return (
    <View style={globalStyles.flexFull}>
      <AppHeader menuEnabled />
      <ScrollView>
        <DetailsTitleView
          title={roomData?.category.name}
          price={roomData?.category.price}
          rating={roomData?.average_rating}
          reviewsCount={roomData?.reviews_count}
        />

        {/* Room Size */}
        <View style={style.container}>
          <Text style={style.headerText}>Room Size</Text>

          <Text style={style.text}>{roomData?.category.size ?? 0} Sqm</Text>
        </View>

        {/* Available beds */}
        <View style={style.container}>
          <Text style={style.headerText}>Available beds</Text>

          <View style={globalStyles.textGap}>
            {roomData?.category.type_of_beds ? (
              Object.entries(roomData.category.type_of_beds).map(
                ([typeOfBed, quantity], index) => (
                  <Text key={index} style={style.text}>
                    {quantity} {typeOfBed}
                  </Text>
                ),
              )
            ) : (
              <Text style={style.text}>Loading...</Text>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={style.container}>
          <Text style={style.headerText}>Room Description</Text>

          {roomData?.description ? (
            <ReadMore
              numberOfLines={4}
              textStyle={style.text}
              linkStyle={style.readMoreText}
            >
              {roomData.description}
            </ReadMore>
          ) : (
            <Text style={style.text}>No room description.</Text>
          )}
        </View>

        {/* Rules */}
        <View style={style.container}>
          <Text style={style.headerText}>Room Rules</Text>

          {roomData?.rules.content ? (
            <ReadMore
              numberOfLines={4}
              textStyle={style.text}
              linkStyle={style.readMoreText}
            >
              {roomData.rules.content}
            </ReadMore>
          ) : (
            <Text style={style.text}>No room rules.</Text>
          )}
        </View>

        {/* Amenities */}
        <View style={style.plainContainer}>
          <View style={style.subHeaderContainer}>
            <Text style={style.headerText}>Property Amenities</Text>
          </View>

          <ListingFeaturesView
            feature={FEATURES.amenities}
            data={roomData?.amenities}
            size={AMENITIES_IN_VIEW}
          />

          {roomData?.amenities?.length > AMENITIES_IN_VIEW && (
            <View style={style.bottomSeeAllContainer}>
              <ButtonLink textStyle={style.seeAllText}>
                See All Amenities
              </ButtonLink>
            </View>
          )}
        </View>

        {/* Reviews */}
        <View style={style.plainContainer}>
          <View style={style.subHeaderContainer}>
            <Text style={style.headerText}>Reviews</Text>

            {roomData?.reviews?.length > REVIEWS_IN_VIEW && (
              <View style={style.rightSeeAllContainer}>
                <ButtonLink textStyle={style.seeAllText}>See All</ButtonLink>
                <Ionicons
                  name="chevron-forward"
                  size={21}
                  color={Colors.blue}
                />
              </View>
            )}
          </View>

          <SliderReviews reviews={roomData?.reviews} size={REVIEWS_IN_VIEW} />
        </View>
      </ScrollView>
      <AppFooter>
        <AppFooterDetails
          title={footerTitle}
          buttonLinkLabel={footerLinkLabel()}
          buttonLinkOnPress={footerLinkOnPress}
          buttonLabel="Reserve"
          buttonOnPress={handleReserveButton}
        />
      </AppFooter>
    </View>
  );
};

export default RoomDetails;
