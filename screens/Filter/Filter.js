import { isBefore, subDays } from "date-fns";
import _ from "lodash";
import React, {
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
import facilityData from "../../data/facilityData";
import { Routes } from "../../navigation/Routes";

const initialState = {
  minPrice: -1,
  maxPrice: -1,
  destination: "",
  checkIn: "",
  checkOut: "",
  facilities: [],
  adults: -1,
  children: -1,
  numOfRooms: -1,
  facilityRating: -1,
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
  { label: "4.5 and above", stars: 5 },
  { label: "4.0 - 4.5", stars: 4.5 },
  { label: "3.5 - 4.0", stars: 4 },
  { label: "3.0 - 3.5", stars: 3 },
  { label: "2.5 - 3.0", stars: 2.5 },
];

const Filter = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const priceRangeRef = useRef(null);
  const scrollViewRef = useRef(null);
  const toast = useToast();

  const handleClear = () => {
    dispatch({ type: "CLEAR_DATA" });
    priceRangeRef.current.reset();

    toast.show("Filter cleared", {
      style: toastStyles.toastInsetFooter,
    });
  };

  const clearDisabled = useMemo(() => {
    return _.isEqual(state, initialState);
  }, [state]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            title="Clear"
            color={clearDisabled ? Colors.lightgray : Colors.blue}
            disabled={clearDisabled}
            onPress={handleClear}
          />
        </HeaderButtons>
      ),
    });
  }, [clearDisabled, navigation]);

  const setData = (payload) => {
    dispatch({ type: "SET_DATA", payload });
  };

  const renderStarRatings = () => {
    const starRatings = [];
    for (const { label, stars } of starSelections) {
      starRatings.push(
        <Pressable
          key={stars}
          onPress={() => {
            if (state.facilityRating === stars) {
              setData({ facilityRating: -1 });
              return;
            }
            setData({ facilityRating: stars });
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
            <StarRatingView rating={stars} starSize={25} labelEnabled={false} />
            <Text style={{ fontSize: 16 }}>{label}</Text>
          </View>
          <FormRadio selected={state.facilityRating === stars} />
        </Pressable>,
      );
    }
    return starRatings;
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={80}
        style={globalStyles.flexFull}
      >
        <ScrollView
          ref={scrollViewRef}
          contentInset={{ bottom: 45 }}
          contentContainerStyle={style.scrollContainer}
          scrollEnabled={isScrollEnabled}
        >
          <View style={style.container}>
            <Text style={style.headerText}>Price Range</Text>
            <PriceRange
              ref={priceRangeRef}
              scrollToTop={() =>
                scrollViewRef.current.scrollTo({ y: 0, animated: true })
              }
              onScrollChange={setIsScrollEnabled}
              onMinPriceChanged={(minPrice) => setData({ minPrice })}
              onMaxPriceChanged={(maxPrice) => setData({ maxPrice })}
              // onPriceRangeChanged={(priceRange) => setData({ priceRange })}
            />
          </View>

          <View style={style.container}>
            <Text style={style.headerText}>Destination</Text>

            <RectButton
              onPress={() => navigation.navigate(Routes.SEARCH)}
              style={style.searchButton}
            >
              <View pointerEvents="none">
                <FormInput
                  placeholder="Where To?"
                  value={state.destination}
                  onChangeText={(destination) => setData({ destination })}
                />
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
                onChangeText={(checkIn) => {
                  if (isBefore(new Date(checkIn), subDays(new Date(), 1))) {
                    setData({ checkIn: "" });
                    return;
                  }
                  setData({ checkIn });

                  if (
                    checkIn &&
                    state.checkOut &&
                    isBefore(new Date(state.checkOut), new Date(checkIn))
                  ) {
                    setData({ checkOut: "" });
                  }
                }}
                dateProps={{ minimumDate: new Date() }}
                containerStyle={style.inputContainer}
              />
              <DashView />
              <FormInput
                type="date"
                placeholder="Check-out"
                value={state.checkOut}
                onChangeText={(checkOut) => {
                  if (
                    isBefore(new Date(checkOut), new Date(state.checkIn)) ||
                    isBefore(new Date(checkOut), subDays(new Date(), 1))
                  ) {
                    setData({ checkOut: "" });
                    return;
                  }
                  setData({ checkOut });
                }}
                dateProps={{
                  minimumDate: state.checkIn
                    ? new Date(state.checkIn)
                    : new Date(),
                }}
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
            <View style={{ marginTop: 5, ...globalStyles.containerGap }}>
              {renderStarRatings()}
            </View>
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
        <ButtonLarge>Apply Filter</ButtonLarge>
      </AppFooter>
    </>
  );
};

export default Filter;
