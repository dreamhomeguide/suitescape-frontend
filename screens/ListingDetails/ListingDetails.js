import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, View } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import Button from "../../components/Button/Button";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import CartSheet from "../../components/CartSheet/CartSheet";
import DetailsDescriptionView from "../../components/DetailsDescriptionView/DetailsDescriptionView";
import DetailsFeaturesView from "../../components/DetailsFeaturesView/DetailsFeaturesView";
import DetailsHostView from "../../components/DetailsHostView/DetailsHostView";
import DetailsLocationView from "../../components/DetailsLocationView/DetailsLocationView";
import DetailsPolicyView from "../../components/DetailsPolicyView/DetailsPolicyView";
import DetailsRatingsView from "../../components/DetailsRatingsView/DetailsRatingsView";
import DetailsReviewsView from "../../components/DetailsReviewsView/DetailsReviewsView";
import DetailsTitleView from "../../components/DetailsTitleView/DetailsTitleView";
import { FEATURES } from "../../components/ListingFeaturesView/ListingFeaturesView";
import SliderGalleryMode from "../../components/SliderGalleryMode/SliderGalleryMode";
import SliderModalPhoto from "../../components/SliderModalPhoto/SliderModalPhoto";
import SliderModalVideo from "../../components/SliderModalVideo/SliderModalVideo";
import { useBookingData } from "../../contexts/BookingContext";
import { useCartContext } from "../../contexts/CartContext";
import { useListingContext } from "../../contexts/ListingContext";
import { ModalGalleryProvider } from "../../contexts/ModalGalleryContext";
import useTransparentHeader from "../../hooks/useTransparentHeader";
import { Routes } from "../../navigation/Routes";
import { fetchListing, incrementViewCount } from "../../services/apiService";
import { handleApiError } from "../../utils/apiHelpers";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const SLIDER_HEIGHT = WINDOW_HEIGHT / 1.6 - 50;
const NEARBY_IN_VIEW = 6;
const REVIEWS_IN_VIEW = 6;

const ListingDetails = ({ route, navigation }) => {
  const listingId = route.params.listingId;

  const [showHeavyComponents, setShowHeavyComponents] = useState(false);

  const { setListing } = useListingContext();
  const { openCart } = useCartContext();
  const bookingData = useBookingData();
  const queryClient = useQueryClient();

  const { data: listing } = useQuery({
    queryKey: ["listings", listingId],
    queryFn: () => fetchListing({ listingId }),
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

  const { yOffset } = useTransparentHeader(SLIDER_HEIGHT);

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

  const onSeeAllReviews = useCallback(() => {
    navigation.push(Routes.RATINGS, {
      id: listingId,
      averageRating: details?.average_rating,
      reviewsCount: details?.reviews_count,
    });
  }, [details?.average_rating, details?.reviews_count, listingId, navigation]);

  const onCheckAvailability = useCallback(() => {
    return navigation.navigate(Routes.SELECT_DATES, {
      listingId,
      screenToNavigate: listing.is_entire_place
        ? listing.addons.length > 0
          ? Routes.ADD_ONS
          : Routes.GUEST_INFO
        : Routes.AVAILABLE_ROOMS,
    });
  }, [listingId, listing?.addons, listing?.is_entire_place, navigation]);

  const onViewRooms = useCallback(() => {
    navigation.navigate(Routes.AVAILABLE_ROOMS, {
      listingId,
    });
  }, [listingId, navigation]);

  const onReservePlace = useCallback(() => {
    navigation.navigate(
      listing.addons.length > 0 ? Routes.ADD_ONS : Routes.GUEST_INFO,
    );
  }, [listing?.addons, navigation]);

  const renderFooterActions = useCallback(() => {
    if (!listing) {
      return <ActivityIndicator />;
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      return (
        <ButtonLarge onPress={onCheckAvailability}>
          Check Availability
        </ButtonLarge>
      );
    }

    if (listing?.is_entire_place) {
      return (
        <View style={globalStyles.buttonRow}>
          <Button
            containerStyle={globalStyles.flexFull}
            outlined
            onPress={onCheckAvailability}
          >
            Change Dates
          </Button>
          <Button
            containerStyle={globalStyles.flexFull}
            onPress={onReservePlace}
          >
            Reserve
          </Button>
        </View>
      );
    }

    return (
      <View style={globalStyles.buttonRow}>
        <Button
          containerStyle={globalStyles.flexFull}
          outlined
          onPress={openCart}
        >
          View Cart
        </Button>
        <Button containerStyle={globalStyles.flexFull} onPress={onViewRooms}>
          View Rooms
        </Button>
      </View>
    );
  }, [
    bookingData.endDate,
    bookingData.startDate,
    listing,
    onCheckAvailability,
    onReservePlace,
    onViewRooms,
  ]);

  return (
    <ModalGalleryProvider>
      {/* Include CartSheet in booking process */}
      <CartSheet />

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
            style={{ height: SLIDER_HEIGHT, ...globalStyles.absoluteTop }}
          />

          <View style={{ height: SLIDER_HEIGHT }}>
            {showHeavyComponents && (
              <SliderGalleryMode
                imageData={images}
                videoData={videos}
                height={SLIDER_HEIGHT}
              />
            )}
          </View>

          {/* Title */}
          <DetailsTitleView
            title={details?.name}
            price={
              details?.is_entire_place
                ? details.entire_place_price
                : details?.lowest_room_price
            }
            rating={details?.average_rating}
            reviewsCount={details?.reviews_count}
            isEntirePlace={details?.is_entire_place}
            onSeeAllReviews={onSeeAllReviews}
          />

          {/* Host Profile */}
          <DetailsHostView
            hostId={host?.id}
            hostName={host?.firstname}
            hostPictureUrl={host?.profile_image_url}
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

        <AppFooter>{renderFooterActions()}</AppFooter>
      </View>
    </ModalGalleryProvider>
  );
};

export default ListingDetails;
