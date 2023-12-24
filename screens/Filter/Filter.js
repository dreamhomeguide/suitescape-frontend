import { isBefore, subDays } from "date-fns";
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
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useToast } from "react-native-toast-notifications";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/searchStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DashView from "../../components/DashView/DashView";
import FormInput from "../../components/FormInput/FormInput";
import FormPicker from "../../components/FormPicker/FormPicker";
import FormRadio from "../../components/FormRadio/FormRadio";
import FormStepper from "../../components/FormStepper/FormStepper";
import PriceRange from "../../components/PriceRange/PriceRange";
import StarRatingView from "../../components/StarRatingView/StarRatingView";
import { useVideoFilter } from "../../contexts/VideoFilterContext";
import facilityData from "../../data/facilityData";
import { Routes } from "../../navigation/Routes";
import convertMMDDYYYY from "../../utilities/dateConverter";

const initialState = {
  minPrice: -1,
  maxPrice: -1,
  checkIn: "",
  checkOut: "",
  destination: "",
  facilities: [],
  adults: -1,
  children: -1,
  numOfRooms: -1,
  minRating: -1,
  maxRating: -1,
  petFriendly: false,
  parkingLot: false,
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

  const [isScrolling, setIsScrolling] = useState(false);

  const scrollViewRef = useRef(null);

  const toast = useToast();
  const { videoFilter, setVideoFilter } = useVideoFilter();

  const setData = (payload) => {
    dispatch({ type: "SET_DATA", payload });
  };

  // Sync filter context with filter screen
  useEffect(() => {
    if (videoFilter) {
      setData(videoFilter);
    }
  }, [videoFilter]);

  // Get destination query from search screen
  useEffect(() => {
    if (route.params?.destination !== undefined) {
      setData({ destination: route.params.destination });
    }
  }, [route.params?.destination]);

  const handleClear = useCallback(() => {
    dispatch({ type: "CLEAR_DATA" });

    // Apply the change to the filter context
    setVideoFilter(null);

    toast.show("Filter cleared", {
      style: toastStyles.toastInsetFooter,
    });
  }, []);

  const isStateReset = useMemo(() => {
    return _.isEqual(state, initialState);
  }, [state]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            title="Clear"
            color={isStateReset ? Colors.lightgray : Colors.blue}
            disabled={isStateReset}
            onPress={handleClear}
          />
        </HeaderButtons>
      ),
    });
  }, [isStateReset, navigation]);

  const renderStarRatings = () => {
    const starRatings = [];
    for (const { label, minRating, maxRating, stars } of starSelections) {
      const selected =
        state.minRating === minRating && state.maxRating === maxRating;

      starRatings.push(
        <Pressable
          key={stars}
          onPress={() => {
            if (selected) {
              setData({ minRating: -1, maxRating: -1 });
              return;
            }
            setData({ minRating, maxRating });
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
  };

  const validateCheckIn = (checkIn, checkOut) => {
    if (isBefore(checkIn, subDays(new Date(), 1))) {
      setData({ checkIn: "" });
      return;
    }

    if (checkIn && checkOut && isBefore(checkOut, checkIn)) {
      setData({ checkOut: "" });
    }
  };

  const validateCheckOut = (checkIn, checkOut) => {
    if (
      isBefore(checkOut, checkIn) ||
      isBefore(checkOut, subDays(new Date(), 1))
    ) {
      setData({ checkOut: "" });
    }
  };

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
          contentContainerStyle={style.scrollContainer}
          onScrollBeginDrag={() => setIsScrolling(true)}
          onScrollEndDrag={() => setIsScrolling(false)}
          onMomentumScrollBegin={() => setIsScrolling(true)}
          onMomentumScrollEnd={() => setIsScrolling(false)}
        >
          <View style={style.container}>
            <Text style={style.headerText}>Price Range</Text>
            <PriceRange
              minimumPrice={state.minPrice}
              maximumPrice={state.maxPrice}
              onMinPriceChanged={(minPrice) => setData({ minPrice })}
              onMaxPriceChanged={(maxPrice) => setData({ maxPrice })}
              // onPriceRangeChanged={(priceRange) => setData({ priceRange })}
              disabled={isScrolling}
            />
          </View>

          <View style={style.container}>
            <Text style={style.headerText}>Destination</Text>

            <RectButton
              onPress={() =>
                navigation.navigate({
                  name: Routes.SEARCH,
                  params: { prevDestination: state.destination },
                })
              }
              style={style.searchButton}
            >
              <View pointerEvents="none">
                <FormInput placeholder="Where To?" value={state.destination} />
              </View>
            </RectButton>
          </View>

          <View style={style.container}>
            <Text style={style.headerText}>Date</Text>
            <View style={style.inputContentContainer}>
              <FormInput
                type="date"
                placeholder="Check-in"
                value={state.checkIn}
                onChangeText={(value) => {
                  setData({ checkIn: value });
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
                    convertMMDDYYYY(state.checkOut),
                  );

                  setData({ checkIn: text });
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

                  const checkInDate = new Date(convertMMDDYYYY(state.checkIn));
                  const checkOutDate = new Date(
                    convertMMDDYYYY(state.checkOut),
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
                value={state.checkOut}
                onChangeText={(value) => {
                  setData({ checkOut: value });
                }}
                onDateConfirm={(checkOut, text) => {
                  // if (
                  //   isBefore(checkOut, convertMMDDYYYY(state.checkIn)) ||
                  //   isBefore(checkOut, subDays(new Date(), 1))
                  // ) {
                  //   setData({ checkOut: "" });
                  //   return;
                  // }
                  const checkInDate = new Date(convertMMDDYYYY(state.checkIn));

                  setData({ checkOut: text });
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
                  const checkInDate = new Date(convertMMDDYYYY(state.checkIn));
                  const checkOutDate = new Date(
                    convertMMDDYYYY(state.checkOut),
                  );

                  validateCheckOut(checkInDate, checkOutDate);
                }}
                dateProps={{
                  minimumDate: state.checkIn
                    ? new Date(convertMMDDYYYY(state.checkIn))
                    : new Date(),
                }}
                keyboardType="number-pad"
                containerStyle={style.inputContainer}
              />
            </View>
          </View>

          <View style={style.container}>
            <Text style={style.headerText}>Type of Facility</Text>
            <View style={style.inputContentContainer}>
              <FormPicker
                label="Facility"
                data={facilityData}
                value={state.facilities}
                onSelected={(selected) => setData({ facilities: selected })}
                multiSelect
              />
            </View>
          </View>

          {/*<View style={style.container}>*/}
          {/*  <Text style={style.headerText}>Type of Facility</Text>*/}
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
            <Text style={style.headerText}>Number of Rooms</Text>
            <FormStepper
              placeholder="Room"
              value={state.numOfRooms}
              onValueChange={(value) => {
                setData({ numOfRooms: value });
              }}
            />
          </View>

          <View style={style.container}>
            <Text style={style.headerText}>Number of Guest</Text>
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
            <Text style={style.headerText}>Facility Rating</Text>
            <View style={globalStyles.textGap}>{renderStarRatings()}</View>
          </View>

          <View style={style.container}>
            <Pressable
              onPress={() => setData({ petFriendly: !state.petFriendly })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <Text style={style.headerText}>Pet Friendly</Text>
              {/*<View style={{ right: -7 }}>*/}
              {/*  <Checkbox.Android*/}
              {/*      status={state.petFriendly ? "checked" : "unchecked"}*/}
              {/*      color={Colors.blue}*/}
              {/*  />*/}
              {/*</View>*/}

              <FormRadio selected={state.petFriendly} />
            </Pressable>

            <Pressable
              onPress={() => setData({ parkingLot: !state.parkingLot })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <Text style={style.headerText}>Parking Lot</Text>
              <FormRadio selected={state.parkingLot} />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppFooter>
        <ButtonLarge
          onPress={() => {
            setVideoFilter(isStateReset ? null : state);
            navigation.goBack();

            // navigation.navigate(Routes.BOTTOM_TABS, {
            //   screen: Routes.HOME,
            //   params: { search: state },
            //   merge: true,
            // })
          }}
        >
          Apply Filter
        </ButtonLarge>
      </AppFooter>
    </>
  );
};

export default Filter;
