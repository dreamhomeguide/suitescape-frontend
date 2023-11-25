import React, { useReducer, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/searchStyles";
import AppHeader from "../../components/AppHeader/AppHeader";
import DashView from "../../components/DashView/DashView";
import FormInput from "../../components/FormInput/FormInput";
import PriceRange from "../../components/PriceRange/PriceRange";
import StepperInput from "../../components/StepperInput/StepperInput";
import facilityData from "../../data/facilityData";

const initialState = {
  priceRange: [0, 0],
  destination: "",
  checkIn: "",
  checkOut: "",
  facility: "",
  adults: 0,
  children: 0,
  numOfRooms: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const Search = () => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const [showFacilityDropdown, setShowFacilityDropdown] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const scrollViewRef = useRef(null);

  const insets = useSafeAreaInsets();

  const setData = (payload) => {
    dispatch({ type: "SET_DATA", payload });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={globalStyles.flexFull}
    >
      <AppHeader />

      <ScrollView
        ref={scrollViewRef}
        contentInset={{ bottom: insets.bottom }}
        contentContainerStyle={style.scrollContainer}
        scrollEnabled={isScrollEnabled}
      >
        <View style={style.container}>
          <Text style={style.headerText}>Price Range</Text>
          <PriceRange
            scrollViewRef={scrollViewRef}
            onPriceRangeChanged={(priceRange) => setData({ priceRange })}
            onScrollChange={setIsScrollEnabled}
          />
        </View>

        <View style={style.container}>
          <Text style={style.headerText}>Destination</Text>
          <FormInput
            placeholder="Where To?"
            value={state.destination}
            onChangeText={(destination) => setData({ destination })}
            useDefaultStyles={false}
          />
        </View>

        <View style={style.container}>
          <Text style={style.headerText}>Date</Text>
          <View style={style.inputContentContainer}>
            <FormInput
              type="date"
              placeholder="Check-in"
              value={state.checkIn}
              onChangeText={(checkIn) => setData({ checkIn })}
              useDefaultStyles={false}
              containerStyle={style.inputContainer}
            />
            <DashView />
            <FormInput
              type="date"
              placeholder="Check-out"
              value={state.checkOut}
              onChangeText={(checkOut) => setData({ checkOut })}
              useDefaultStyles={false}
              containerStyle={style.inputContainer}
            />
          </View>
        </View>

        <View style={style.container}>
          <Text style={style.headerText}>Type of Facility</Text>
          <View style={style.inputContentContainer}>
            <FormInput
              type="dropdown"
              label="Facility"
              value={state.facility}
              setValue={(facility) => setData({ facility })}
              visible={showFacilityDropdown}
              onDismiss={() => setShowFacilityDropdown(false)}
              showDropDown={() => setShowFacilityDropdown(true)}
              list={facilityData}
              useDefaultStyles={false}
              containerStyle={style.inputContainer}
            />
          </View>
        </View>

        <View style={style.container}>
          <Text style={style.headerText}>Number of Rooms</Text>
          <View style={style.inputContentContainer}>
            <StepperInput
              placeholder="Room"
              value={state.numOfRooms}
              onValueChange={(value) => {
                setData({ numOfRooms: value });
              }}
            />
          </View>
        </View>

        <View style={style.container}>
          <Text style={style.headerText}>Number of Guest</Text>
          <View style={style.inputContentContainer}>
            <StepperInput
              placeholder="Adult"
              value={state.adults}
              onValueChange={(value) => {
                setData({ adults: value });
              }}
            />
          </View>

          <View style={style.inputContentContainer}>
            <StepperInput
              placeholder="Children"
              value={state.children}
              onValueChange={(value) => {
                setData({ children: value });
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Search;
