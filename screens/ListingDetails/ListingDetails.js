import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, useWindowDimensions, View } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DetailsDescriptionView from "../../components/DetailsDescriptionView/DetailsDescriptionView";
import DetailsFeaturesView from "../../components/DetailsFeaturesView/DetailsFeaturesView";
import DetailsHostView from "../../components/DetailsHostView/DetailsHostView";
import DetailsLocationView from "../../components/DetailsLocationView/DetailsLocationView";
import DetailsPolicyView from "../../components/DetailsPolicyView/DetailsPolicyView";
import DetailsRatingsView from "../../components/DetailsRatingsView/DetailsRatingsView";
import DetailsReviewsView from "../../components/DetailsReviewsView/DetailsReviewsView";
import DetailsTitleView from "../../components/DetailsTitleView/DetailsTitleView";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { FEATURES } from "../../components/ListingFeaturesView/ListingFeaturesView";
import SliderGalleryMode from "../../components/SliderGalleryMode/SliderGalleryMode";
import SliderModalPhoto from "../../components/SliderModalPhoto/SliderModalPhoto";
import SliderModalVideo from "../../components/SliderModalVideo/SliderModalVideo";
import { useBookingContext } from "../../contexts/BookingContext";
import { useListingContext } from "../../contexts/ListingContext";
import { ModalGalleryProvider } from "../../contexts/ModalGalleryContext";
import { Routes } from "../../navigation/Routes";
import { fetchListing, incrementViewCount } from "../../services/apiService";
import { handleApiError } from "../../utils/apiHelpers";

const NEARBY_IN_VIEW = 6;
const REVIEWS_IN_VIEW = 6;

const ListingDetails = ({ route, navigation }) => {
  const listingId = route.params.listingId;

  const [showHeavyComponents, setShowHeavyComponents] = useState(false);

  const { setListing } = useListingContext();
  const { clearDates } = useBookingContext();
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();

  const sliderHeight = height / 1.6 - 50;

  const yOffset = useRef(new Animated.Value(0)).current;
  const headerOpacity = yOffset.interpolate({
    inputRange: [0, sliderHeight],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const { data: listing } = useQuery({
    queryKey: ["listings", listingId],
    queryFn: () => fetchListing(listingId),
    // enabled: showHeavyComponents,
  });

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

  // Change back button color when gallery is not visible
  useEffect(() => {
    navigation.setOptions({
      headerTitle: ({ children }) => (
        <HeaderTitle containerStyle={{ opacity: headerOpacity }}>
          {children}
        </HeaderTitle>
      ),
      headerBackground: () => (
        <Animated.View
          style={{
            backgroundColor: Colors.blue,
            opacity: headerOpacity,
            ...StyleSheet.absoluteFillObject,
          }}
        />
      ),
    });
  }, [headerOpacity, navigation]);

  // Set listing to global context on focus
  useFocusEffect(
    useCallback(() => {
      setListing(listing);
    }, [listing]),
  );

  // Clear global listing and dates on unmount
  useEffect(() => {
    return () => {
      setListing(null);
      clearDates();
    };
  }, []);

  // Delay showing heavy components
  useEffect(() => {
    return navigation.addListener("transitionEnd", () => {
      setShowHeavyComponents(true);
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        // Increment view count of listing
        await incrementViewCount({ listingId });

        await queryClient.invalidateQueries({
          queryKey: ["profile", "saved"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["profile", "liked"],
        });
      } catch (err) {
        handleApiError({ error: err, defaultAlert: true });
      }
    })();
  }, []);

  const onSeeAllReviews = useCallback(
    () =>
      navigation.push(Routes.RATINGS, {
        type: "listing",
        id: listingId,
        averageRating: details?.average_rating,
        reviewsCount: details?.reviews_count,
      }),
    [details?.average_rating, details?.reviews_count, listingId, navigation],
  );

  const onSelectDates = useCallback(
    () =>
      navigation.navigate(Routes.SELECT_DATES, {
        listingId,
        screenToNavigate: Routes.AVAILABLE_ROOMS,
      }),
    [listingId, navigation],
  );

  return (
    <ModalGalleryProvider>
      <StatusBar
        animated
        translucent
        // style={isGalleryVisible || !isFocused ? "light" : "auto"}
        style="light"
        backgroundColor="rgba(0,0,0,0.2)"
      />

      {showHeavyComponents && (
        <>
          <SliderModalPhoto imageData={images} galleryMode />
          <SliderModalVideo videoData={videos} listing={listing} />
        </>
      )}

      <View style={globalStyles.flexFull}>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: yOffset } } }],
            {
              useNativeDriver: true,
            },
          )}
          contentContainerStyle={globalStyles.rowGap}
          scrollEventThrottle={16}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            locations={[0, 0.3]}
            pointerEvents="none"
            style={{ height: sliderHeight, ...globalStyles.absoluteTop }}
          />

          <View style={{ height: sliderHeight }}>
            {showHeavyComponents && (
              <SliderGalleryMode
                imageData={images ?? null}
                videoData={videos ?? null}
                height={sliderHeight}
              />
            )}
          </View>

          {/* Title */}
          <DetailsTitleView
            title={details?.name}
            price={details?.lowest_room_price}
            rating={details?.average_rating}
            reviewsCount={details?.reviews_count}
            onSeeAllReviews={onSeeAllReviews}
          />

          {/* Host Profile */}
          <DetailsHostView
            hostId={host?.id}
            hostName={host?.firstname}
            hostPictureUrl={host?.picture_url}
          />

          {/* Booking and Cancellation Policy */}
          <DetailsPolicyView
            bookingPolicies={bookingPolicies}
            cancellationPolicy={details.cancellation_policy}
          />

          {/* Description */}
          <DetailsDescriptionView description={details?.description} />

          {showHeavyComponents && (
            <>
              {/* Location */}
              <DetailsLocationView location={details?.location} />

              {/* Places Nearby */}
              <DetailsFeaturesView
                feature={FEATURES.placesNearby}
                data={nearbyPlaces}
                size={NEARBY_IN_VIEW}
              />

              {/* Service Rating */}
              <DetailsRatingsView serviceRating={serviceRating} />

              {/* Reviews */}
              <DetailsReviewsView
                reviews={reviews}
                onSeeAllReviews={onSeeAllReviews}
                size={REVIEWS_IN_VIEW}
              />
            </>
          )}

          {/* Report Listing */}
          {/*<View*/}
          {/*  style={{*/}
          {/*    ...style.container,*/}
          {/*    ...style.reportContainer,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <ButtonIconRow*/}
          {/*    onPress={() => console.log("Report this listing")}*/}
          {/*    reverse*/}
          {/*    label="Report this listing"*/}
          {/*    textStyle={style.emphasizedText}*/}
          {/*  >*/}
          {/*    <FontAwesome name="flag-o" size={25} color={Colors.red} />*/}
          {/*  </ButtonIconRow>*/}
          {/*</View>*/}
        </Animated.ScrollView>

        <AppFooter>
          <ButtonLarge onPress={onSelectDates}>Check Availability</ButtonLarge>
        </AppFooter>
      </View>
    </ModalGalleryProvider>
  );
};

export default ListingDetails;
