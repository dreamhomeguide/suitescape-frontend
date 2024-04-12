import { useQueryClient } from "@tanstack/react-query";
import { format, isBefore, subDays } from "date-fns";
import _ from "lodash";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useToast } from "react-native-toast-notifications";
import { Item } from "react-navigation-header-buttons";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/searchStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DashView from "../../components/DashView/DashView";
import FormInput, {
  VALID_INPUT_DATE,
} from "../../components/FormInput/FormInput";
import FormPicker from "../../components/FormPicker/FormPicker";
import FormRadio from "../../components/FormRadio/FormRadio";
import FormStepper from "../../components/FormStepper/FormStepper";
import PriceRange from "../../components/PriceRange/PriceRange";
import StarRatingView from "../../components/StarRatingView/StarRatingView";
import { useVideoFilters } from "../../contexts/VideoFiltersContext";
import facilityData from "../../data/facilityData";
import { Routes } from "../../navigation/Routes";
import convertDateFormat from "../../utils/dateConverter";

const initialState = {
  min_price: -1,
  max_price: -1,
  check_in: "",
  check_out: "",
  destination: "",
  facilities: [],
  adults: -1,
  children: -1,
  rooms: -1,
  min_rating: -1,
  max_rating: -1,
  amenities: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLEAR_DATA":
      return initialState;
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const starSelections = [
  { label: "4.5 and above", minRating: 4.5, maxRating: 5, stars: 5 },
  { label: "4.0 - 4.5", minRating: 4.0, maxRating: 4.5, stars: 4.5 },
  { label: "3.5 - 4.0", minRating: 3.5, maxRating: 4.0, stars: 4 },
  { label: "3.0 - 3.5", minRating: 3.0, maxRating: 3.5, stars: 3 },
  { label: "2.5 - 3.0", minRating: 2.5, maxRating: 3.0, stars: 2.5 },
];

const Filter = ({ navigation, route }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);
  const [showFilters, setShowFilters] = useState(false);

  const scrollViewRef = useRef(null);

  const { videoFilters, setVideoFilters } = useVideoFilters();
  const toast = useToast();
  const queryClient = useQueryClient();

  const videoFiltersEmptyOrNull =
    !videoFilters || Object.keys(videoFilters).length === 0;

  const setData = useCallback((payload) => {
    dispatch({ type: "SET_DATA", payload });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowFilters(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  // Sync filter context with this screen
  useEffect(() => {
    if (videoFilters) {
      const convertToAmenitiesObject = (amenities) => {
        if (!amenities) {
          return {};
        }

        const amenitiesObject = {};
        for (const amenity of amenities) {
          amenitiesObject[amenity] = true;
        }
        return amenitiesObject;
      };

      setData({
        ...videoFilters,
        amenities: convertToAmenitiesObject(videoFilters.amenities),
        check_in: videoFilters.check_in
          ? format(new Date(videoFilters.check_in), VALID_INPUT_DATE)
          : initialState.check_in,
        check_out: videoFilters.check_out
          ? format(new Date(videoFilters.check_out), VALID_INPUT_DATE)
          : initialState.check_out,
      });
    }
  }, [videoFilters]);

  // Get destination query from search screen
  useEffect(() => {
    if (route.params?.destination !== undefined) {
      setData({ destination: route.params.destination });
    }
  }, [route.params?.destination]);

  const handleClear = useCallback(() => {
    dispatch({ type: "CLEAR_DATA" });

    toast.show("Filter cleared", {
      style: toastStyles.toastInsetFooter,
      duration: 800,
    });

    // Prevents from accidentally refreshing index of video feed
    if (videoFiltersEmptyOrNull) {
      return;
    }

    // Apply the change to the filter context
    setVideoFilters({});

    // Apply filter timeout, since setting video filters is resource intensive
    // applyFilterTimeout.current = setTimeout(() => {
    // Show first so it wouldn't lag
    // toast.show("Filter cleared", {
    //   style: toastStyles.toastInsetFooter,
    //   duration: 800,
    // });

    // Apply the change to the filter context
    // setVideoFilters({});
    // }, 20);

    // Loading timeout
    // loadingTimeout.current = setTimeout(() => {
    //   // if (videoFilters && Object.keys(videoFilters).length > 0) {
    //   //   setShowHome(true);
    //   //   return;
    //   // }
    //   setIsLoading(false);
    // }, 20);
  }, [toast, videoFilters]);

  const isStateReset = useMemo(() => {
    return _.isEqual(state, initialState);
  }, [state]);

  const headerRight = useCallback(() => {
    return (
      <Item
        title="Clear"
        color={isStateReset ? "rgba(255,255,255,0.4)" : "white"}
        disabled={isStateReset}
        onPress={handleClear}
      />
    );
  }, [handleClear, isStateReset]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  // useEffect(() => {
  //   if (!isFetchingVideos && showHome) {
  //     setIsLoading(false);
  //     navigation.goBack();
  //   }
  // }, [isFetchingVideos, showHome]);

  const facilities = useMemo(
    () =>
      Object.entries(facilityData).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    [],
  );

  const getAmenityNames = useCallback((amenities) => {
    return Object.entries(amenities)
      .filter(([, value]) => value)
      .map(([key]) => key);
  }, []);

  const onApplyFilter = useCallback(() => {
    const filters = {
      ...state,
      amenities: getAmenityNames(state.amenities),
      check_in: state.check_in
        ? convertDateFormat(state.check_in)
        : initialState.check_in,
      check_out: state.check_out
        ? convertDateFormat(state.check_out)
        : initialState.check_out,
    };

    if (
      (isStateReset && videoFiltersEmptyOrNull) ||
      _.isEqual(filters, videoFilters)
    ) {
      navigation.goBack();
      return;
    }

    queryClient
      .invalidateQueries({ queryKey: ["videos", videoFilters] })
      .then(() => {
        setVideoFilters(isStateReset ? {} : filters);
        navigation.goBack();
      });

    // if (
    //   !_.isEqual(filters, videoFilters) &&
    //   !(isStateReset && videoFiltersEmpty)
    // ) {
    //   setVideoFilters(isStateReset ? {} : filters);
    // }
    //
    // navigation.goBack();

    // navigation.navigate(Routes.BOTTOM_TABS, {
    //   screen: Routes.HOME,
    //   params: { search: state },
    //   merge: true,
    // })
  }, [getAmenityNames, isStateReset, navigation, state, videoFilters]);

  const validateCheckIn = useCallback((checkIn, checkOut) => {
    if (isBefore(checkIn, subDays(new Date(), 1))) {
      setData({ check_in: initialState.check_in });
      return;
    }

    if (checkIn && checkOut && isBefore(checkOut, checkIn)) {
      setData({ check_out: initialState.check_in });
    }
  }, []);

  const validateCheckOut = useCallback((checkIn, checkOut) => {
    if (
      isBefore(checkOut, checkIn) ||
      isBefore(checkOut, subDays(new Date(), 1))
    ) {
      setData({ check_out: initialState.check_out });
    }
  }, []);

  const renderStarRatings = useCallback(() => {
    const starRatings = [];
    for (const { label, minRating, maxRating, stars } of starSelections) {
      const selected =
        state.min_rating === minRating && state.max_rating === maxRating;

      starRatings.push(
        <Pressable
          key={stars}
          onPress={() => {
            if (selected) {
              setData({
                min_rating: initialState.min_rating,
                max_rating: initialState.max_rating,
              });
              return;
            }
            setData({ min_rating: minRating, max_rating: maxRating });
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <StarRatingView rating={stars} starSize={26} labelEnabled={false} />
            <Text style={{ fontSize: 16 }}>{label}</Text>
          </View>
          <FormRadio selected={selected} />
        </Pressable>,
      );
    }
    return starRatings;
  }, [state.min_rating, state.max_rating]);

  if (!showFilters) {
    return (
      <>
        <ActivityIndicator size="small" style={globalStyles.loadingCircle} />
      </>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        style={globalStyles.flexFull}
      >
        <ScrollView
          ref={scrollViewRef}
          contentInset={{ bottom: 40 }}
          contentContainerStyle={style.filterContainer}
        >
          <View style={style.container}>
            <Text style={style.filterHeaderText}>Price Range</Text>
            <PriceRange
              minimumPrice={state.min_price}
              maximumPrice={state.max_price}
              onMinPriceChanged={(minPrice) => setData({ min_price: minPrice })}
              onMaxPriceChanged={(maxPrice) => setData({ max_price: maxPrice })}
              // onPriceRangeChanged={(priceRange) => setData({ priceRange })}
            />
          </View>

          <View style={style.container}>
            <Text style={style.filterHeaderText}>Destination</Text>

            <RectButton
              onPress={() => {
                const adults = state.adults <= 0 ? 0 : state.adults;
                const children = state.children <= 0 ? 0 : state.children;

                navigation.navigate({
                  name: Routes.SEARCH,
                  params: {
                    prevDestination: state.destination,
                    checkIn: state.check_in,
                    checkOut: state.check_out,
                    guests: adults + children,
                  },
                });
              }}
              style={style.searchButton}
            >
              <View pointerEvents="none">
                <FormInput placeholder="Where To?" value={state.destination} />
              </View>
            </RectButton>
          </View>

          <View style={style.container}>
            <Text style={style.filterHeaderText}>Date</Text>
            <View style={style.inputContentContainer}>
              <FormInput
                type="date"
                placeholder="Check-in"
                value={state.check_in}
                onChangeText={(value) => {
                  setData({ check_in: value });
                }}
                onDateConfirm={(checkIn, text) => {
                  // if (isBefore(checkIn, subDays(new Date(), 1))) {
                  //   setData({ checkIn: "" });
                  //   return;
                  // }
                  // setData({ checkIn: text });
                  //
                  // if (
                  //   checkIn &&
                  //   state.checkOut &&
                  //   isBefore(convertMMDDYYYY(state.checkOut), checkIn)
                  // ) {
                  //   setData({ checkOut: "" });
                  // }
                  const checkOutDate = new Date(
                    convertDateFormat(state.check_out),
                  );

                  setData({ check_in: text });
                  validateCheckIn(checkIn, checkOutDate);
                }}
                onBlur={() => {
                  // if (
                  //   isBefore(
                  //     convertMMDDYYYY(state.checkIn),
                  //     subDays(new Date(), 1),
                  //   )
                  // ) {
                  //   setData({ checkIn: "" });
                  //   return;
                  // }
                  //
                  // if (
                  //   state.checkIn &&
                  //   state.checkOut &&
                  //   isBefore(
                  //     convertMMDDYYYY(state.checkOut),
                  //     convertMMDDYYYY(state.checkIn),
                  //   )
                  // ) {
                  //   setData({ checkOut: "" });
                  // }

                  const checkInDate = new Date(
                    convertDateFormat(state.check_in),
                  );
                  const checkOutDate = new Date(
                    convertDateFormat(state.check_out),
                  );

                  validateCheckIn(checkInDate, checkOutDate);
                }}
                dateProps={{ minimumDate: new Date() }}
                keyboardType="number-pad"
                containerStyle={style.inputContainer}
              />
              <DashView />
              <FormInput
                type="date"
                placeholder="Check-out"
                value={state.check_out}
                onChangeText={(value) => {
                  setData({ check_out: value });
                }}
                onDateConfirm={(checkOut, text) => {
                  // if (
                  //   isBefore(checkOut, convertMMDDYYYY(state.checkIn)) ||
                  //   isBefore(checkOut, subDays(new Date(), 1))
                  // ) {
                  //   setData({ checkOut: "" });
                  //   return;
                  // }
                  const checkInDate = new Date(
                    convertDateFormat(state.check_in),
                  );

                  setData({ check_out: text });
                  validateCheckOut(checkInDate, checkOut);
                }}
                onBlur={() => {
                  // if (
                  //   isBefore(
                  //     convertMMDDYYYY(state.checkOut),
                  //     convertMMDDYYYY(state.checkIn),
                  //   ) ||
                  //   isBefore(
                  //     convertMMDDYYYY(state.checkOut),
                  //     subDays(new Date(), 1),
                  //   )
                  // ) {
                  //   setData({ checkOut: "" });
                  // }
                  const checkInDate = new Date(
                    convertDateFormat(state.check_in),
                  );
                  const checkOutDate = new Date(
                    convertDateFormat(state.check_out),
                  );

                  validateCheckOut(checkInDate, checkOutDate);
                }}
                dateProps={{
                  minimumDate: state.check_in
                    ? new Date(convertDateFormat(state.check_in))
                    : new Date(),
                }}
                keyboardType="number-pad"
                containerStyle={style.inputContainer}
              />
            </View>
          </View>

          <View style={style.container}>
            <Text style={style.filterHeaderText}>Type of Facility</Text>
            <View style={style.inputContentContainer}>
              <FormPicker
                label="Facility"
                data={facilities}
                value={state.facilities}
                onSelected={(selected) => setData({ facilities: selected })}
                multiSelect
              />
            </View>
          </View>

          {/*<View style={style.container}>*/}
          {/*  <Text style={style.filterHeaderText}>Type of Facility</Text>*/}
          {/*  <View style={style.inputContentContainer}>*/}
          {/*    <FormInput*/}
          {/*      type="dropdown"*/}
          {/*      label="Facility"*/}
          {/*      value={state.facility}*/}
          {/*      setValue={(facility) => setData({ facility })}*/}
          {/*      multiSelect*/}
          {/*      visible={showFacilityDropdown}*/}
          {/*      onDismiss={() => setShowFacilityDropdown(false)}*/}
          {/*      showDropDown={() => setShowFacilityDropdown(true)}*/}
          {/*      list={facilityData}*/}
          {/*      useDefaultStyles={false}*/}
          {/*      containerStyle={style.inputContainer}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*</View>*/}

          <View style={style.container}>
            <Text style={style.filterHeaderText}>Number of Rooms</Text>
            <FormStepper
              placeholder="Room"
              value={state.rooms}
              onValueChange={(value) => {
                setData({ rooms: value });
              }}
            />
          </View>

          <View style={style.container}>
            <Text style={style.filterHeaderText}>Number of Guest</Text>
            <View style={globalStyles.largeContainerGap}>
              <FormStepper
                placeholder="Adult"
                value={state.adults}
                onValueChange={(value) => {
                  setData({ adults: value });
                }}
              />
              <FormStepper
                placeholder="Children"
                value={state.children}
                onValueChange={(value) => {
                  setData({ children: value });
                }}
              />
            </View>
          </View>

          <View style={style.container}>
            <Text style={style.filterHeaderText}>Facility Rating</Text>
            <View style={globalStyles.textGap}>{renderStarRatings()}</View>
          </View>

          <View style={style.container}>
            <Pressable
              onPress={() =>
                setData({
                  amenities: {
                    ...state.amenities,
                    pet_friendly: !state.amenities.pet_friendly,
                  },
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <Text style={style.filterHeaderText}>Pet Friendly</Text>
              {/*<View style={{ right: -7 }}>*/}
              {/*  <Checkbox.Android*/}
              {/*      status={state.petFriendly ? "checked" : "unchecked"}*/}
              {/*      color={Colors.blue}*/}
              {/*  />*/}
              {/*</View>*/}

              <FormRadio selected={state.amenities.pet_friendly} />
            </Pressable>

            <Pressable
              onPress={() =>
                setData({
                  amenities: {
                    ...state.amenities,
                    parking_lot: !state.amenities.parking_lot,
                  },
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <Text style={style.filterHeaderText}>Parking Lot</Text>
              <FormRadio selected={state.amenities.parking_lot} />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppFooter>
        <ButtonLarge onPress={onApplyFilter}>Apply Filter</ButtonLarge>
      </AppFooter>
    </>
  );
};

export default Filter;
