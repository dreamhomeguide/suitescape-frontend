import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect } from "react";
import { Alert, Linking, Platform, ScrollView, Text, View } from "react-native";
import MapView from "react-native-maps";
import { HiddenItem, OverflowMenu } from "react-navigation-header-buttons";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonIconRow from "../../components/ButtonIconRow/ButtonIconRow";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import DetailsHostView from "../../components/DetailsHostView/DetailsHostView";
import DetailsTitleView from "../../components/DetailsTitleView/DetailsTitleView";
import ListingFeaturesView, {
  FEATURES,
} from "../../components/ListingFeaturesView/ListingFeaturesView";
import ReadMore from "../../components/ReadMore/ReadMore";
import ServiceRating from "../../components/ServiceRating/ServiceRating";
import SliderGalleryMode from "../../components/SliderGalleryMode/SliderGalleryMode";
import SliderModalPhoto from "../../components/SliderModalPhoto/SliderModalPhoto";
import SliderModalVideo from "../../components/SliderModalVideo/SliderModalVideo";
import SliderReviews from "../../components/SliderReviews/SliderReviews";
import { useBookingContext } from "../../contexts/BookingContext";
import { useListingContext } from "../../contexts/ListingContext";
import { ModalGalleryProvider } from "../../contexts/ModalGalleryContext";
import useFetchAPI from "../../hooks/useFetchAPI";
import { Routes } from "../../navigation/Routes";

const NEARBY_IN_VIEW = 6;
const REVIEWS_IN_VIEW = 6;

const angelesRegion = {
  latitude: 15.15999887575342,
  latitudeDelta: 0.10724659348830379,
  longitude: 120.58167931503255,
  longitudeDelta: 0.21333772519169258,
};

const ListingDetails = ({ route, navigation }) => {
  const listingId = route.params.listingId;

  const { data: listing } = useFetchAPI(`/listings/${listingId}`);
  const { setListing } = useListingContext();
  const { clearBookingInfo } = useBookingContext();
  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <OverflowMenu
          OverflowIcon={() => (
            <Ionicons name="menu" color={colors.text} size={25} />
          )}
        >
          <HiddenItem title="Example" onPress={() => console.log("Example")} />
        </OverflowMenu>
      ),
    });
  }, [navigation]);

  // Set listing to global context
  useEffect(() => {
    setListing(listing);
  }, [listing]);

  // Clear global listing and guest info on unmount
  useEffect(() => {
    return () => {
      clearBookingInfo();
      setListing(null);
    };
  }, []);

  const {
    host,
    images,
    videos,
    reviews,
    service_rating: serviceRating,
    nearby_places: nearbyPlaces,
    booking_policies: bookingPolicies,
    ...details
  } = listing || {};

  // const hostJoinedDate =
  //   hostData?.createdAt &&
  //   new Date(hostData.createdAt).toLocaleDateString(undefined, {
  //     year: 'numeric',
  //     month: 'long',
  //   });

  const onLocationPress = () => {
    // Default maps app
    // const scheme = Platform.select({
    //   ios: 'maps:',
    //   android: 'geo:',
    // });
    //
    // const url =
    //   scheme + `${angelesRegion.latitude},${angelesRegion.longitude}?q=Angeles`;
    //
    // Linking.openURL(url).catch(err => console.error(err));

    // Google maps api
    // daddr = destination address
    // saddr = source address
    // q = query search
    // center = show a map

    Linking.openURL(
      Platform.OS === "ios"
        ? `googleMaps://app?q=${details?.location}`
        : `google.navigation:q=${details?.location}`,
    ).catch(() => Alert.alert("Failed to open Google Maps."));
  };

  return (
    <ModalGalleryProvider>
      <SliderModalPhoto imageData={images} />
      <SliderModalVideo videoData={videos} listing={listing} />

      <View style={globalStyles.flexFull}>
        <ScrollView>
          <SliderGalleryMode
            imageData={images ?? null}
            videoData={videos ?? null}
          />

          {/* Title */}
          <DetailsTitleView
            title={details?.name}
            price={details?.lowest_room_price}
            rating={details?.average_rating}
            reviewsCount={details?.reviews_count}
          />

          {/* Host Profile */}
          <DetailsHostView hostName={host?.firstname} />

          {bookingPolicies && details && (
            <View
              style={{ ...style.container, ...globalStyles.largeContainerGap }}
            >
              {/* Booking Policy */}
              {bookingPolicies.length > 0 && (
                <View>
                  <Text style={style.headerText}>Booking Policy</Text>
                  <>
                    {bookingPolicies.map((policy, index) => (
                      <Text key={index} style={style.emphasizedText}>
                        {policy.name}
                      </Text>
                    ))}
                  </>
                </View>
              )}

              {/* Cancellation Policy */}
              {details.cancellation_policy && (
                <View>
                  <Text style={style.headerText}>Cancellation Policy</Text>

                  <Text style={style.emphasizedText}>
                    {details.cancellation_policy}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Description */}
          <View style={style.container}>
            <Text style={style.headerText}>Description</Text>

            {details?.description ? (
              <ReadMore
                numberOfLines={4}
                textStyle={style.text}
                linkStyle={style.readMoreText}
              >
                {details.description}
              </ReadMore>
            ) : (
              <Text style={style.text}>No description.</Text>
            )}
          </View>

          {/* Location */}
          <View style={style.container}>
            <Text style={style.headerText}>Location</Text>

            {details?.location ? (
              <>
                {/* Map View only available to iOS for now */}
                <View style={style.locationContainer}>
                  {Platform.OS === "ios" && (
                    <MapView
                      style={style.locationContainer}
                      region={angelesRegion}
                      // scrollEnabled={false}
                      // zoomEnabled={false}
                    />
                  )}
                </View>

                <ButtonLink
                  textStyle={{ ...style.text, ...style.link }}
                  onPress={onLocationPress}
                >
                  {details.location}
                </ButtonLink>
              </>
            ) : (
              <Text style={style.text}>No location specified.</Text>
            )}
          </View>

          {/* Places Nearby */}
          <View style={style.plainContainer}>
            <View style={style.subHeaderContainer}>
              <Text style={style.headerText}>Places Nearby</Text>
            </View>

            <ListingFeaturesView
              feature={FEATURES.placesNearby}
              data={nearbyPlaces}
              size={NEARBY_IN_VIEW}
            />

            {nearbyPlaces?.length > NEARBY_IN_VIEW && (
              <View style={style.bottomSeeAllContainer}>
                <ButtonLink textStyle={style.seeAllText}>
                  See All Places Nearby
                </ButtonLink>
              </View>
            )}
          </View>

          {/* Service Rating */}
          <View style={style.container}>
            <Text style={style.headerText}>Service Rating</Text>
            <View
              style={{
                ...style.serviceRatingContainer,
                ...globalStyles.containerGap,
              }}
            >
              <>
                {serviceRating ? (
                  Object.entries(serviceRating).map(([key, value], index) => (
                    <ServiceRating label={key} rating={value} key={index} />
                  ))
                ) : (
                  <Text style={style.text}>No service rating yet.</Text>
                )}
              </>
            </View>
          </View>

          {/* Reviews */}
          <View style={style.plainContainer}>
            <View style={style.subHeaderContainer}>
              <Text style={style.headerText}>Reviews</Text>

              {reviews?.length > REVIEWS_IN_VIEW && (
                <View style={style.rightSeeAllContainer}>
                  <ButtonIconRow
                    gap={1}
                    textStyle={style.seeAllText}
                    label="See All"
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={21}
                      color={Colors.blue}
                    />
                  </ButtonIconRow>
                </View>
              )}
            </View>

            <SliderReviews reviews={reviews} size={REVIEWS_IN_VIEW} />
          </View>

          {/* Report Listing */}
          <View
            style={{
              ...style.container,
              ...style.reportContainer,
            }}
          >
            <ButtonIconRow
              onPress={() => console.log("Report this listing")}
              reverse
              label="Report this listing"
              textStyle={style.emphasizedText}
            >
              <FontAwesome name="flag-o" size={25} color={Colors.red} />
            </ButtonIconRow>
          </View>
        </ScrollView>

        <AppFooter>
          <ButtonLarge
            onPress={() =>
              navigation.navigate(Routes.CHECK_AVAILABILITY, { listingId })
            }
          >
            Check Availability
          </ButtonLarge>
        </AppFooter>
      </View>
    </ModalGalleryProvider>
  );
};

export default ListingDetails;
