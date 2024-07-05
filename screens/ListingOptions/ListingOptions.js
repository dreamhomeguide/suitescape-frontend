import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Checkbox } from "react-native-ui-lib";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import FormStepper from "../../components/FormStepper/FormStepper";
import ListingPriceInput from "../../components/ListingPriceInput/ListingPriceInput";
import ListingTimeSelector from "../../components/ListingTimeSelector/ListingTimeSelector";
import { useCreateListingContext } from "../../contexts/CreateListingContext";

const ListingOptions = () => {
  const { listingState, setListingData } = useCreateListingContext();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={80}
      style={globalStyles.flexFull}
    >
      <ScrollView
        contentInset={{ top: 10, bottom: 35 }}
        contentContainerStyle={globalStyles.rowGapSmall}
      >
        <View style={style.viewContainer}>
          <Text style={globalStyles.smallHeaderText}>Time</Text>
          <ListingTimeSelector
            checkInTime={listingState.checkInTime}
            checkOutTime={listingState.checkOutTime}
            totalHours={listingState.totalHours}
            onTimeChange={(value, type) => setListingData({ [type]: value })}
            onTotalHoursChange={(value, isSameDay) =>
              setListingData({
                totalHours: value,
                isCheckInOutSameDay: isSameDay,
              })
            }
          />
        </View>

        {listingState.isEntirePlace && (
          <>
            <View style={style.viewContainer}>
              <Text style={globalStyles.smallHeaderText}>
                Entire Place Pricing
              </Text>
              <ListingPriceInput
                weekDayPrice={listingState.entirePlaceWeekdayPrice}
                weekendPrice={listingState.entirePlaceWeekendPrice}
                onWeekdayPriceChange={(value) => {
                  setListingData({ entirePlaceWeekdayPrice: value });
                }}
                onWeekendPriceChange={(value) => {
                  setListingData({ entirePlaceWeekendPrice: value });
                }}
              />
            </View>

            <View style={style.viewContainer}>
              <Text style={globalStyles.smallHeaderText}>Guest Capacity</Text>
              <FormStepper
                label="Adult"
                placeholder="Adult"
                value={listingState.adultCapacity}
                onValueChange={(value) => {
                  if (value !== null && value === 0) {
                    setListingData({ adultCapacity: 1 });
                    Alert.alert("Adult capacity must be at least 1.");
                    return;
                  }

                  setListingData({ adultCapacity: value });
                }}
              />
              <FormStepper
                label="Children"
                placeholder="Children"
                value={listingState.childCapacity}
                onValueChange={(value) => {
                  setListingData({ childCapacity: value });
                }}
              />
            </View>
          </>
        )}

        <View style={style.viewContainer}>
          <View style={globalStyles.rowGap}>
            <Pressable
              onPress={() =>
                setListingData({ isPetFriendly: !listingState.isPetFriendly })
              }
              style={({ pressed }) => ({
                ...style.rowContainer,
                ...pressedOpacity(pressed),
              })}
            >
              <Text style={style.label}>Is Pet Friendly?</Text>
              <Checkbox
                value={listingState.isPetFriendly}
                size={23}
                color={Colors.blue}
                style={style.checkbox}
              />
            </Pressable>

            <Pressable
              onPress={() =>
                setListingData({ parkingLot: !listingState.parkingLot })
              }
              style={({ pressed }) => ({
                ...style.rowContainer,
                ...pressedOpacity(pressed),
              })}
            >
              <Text style={style.label}>Parking Lot</Text>
              <Checkbox
                value={listingState.parkingLot}
                size={23}
                color={Colors.blue}
                style={style.checkbox}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ListingOptions;
