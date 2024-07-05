import Entypo from "@expo/vector-icons/Entypo";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { Item } from "react-navigation-header-buttons";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import BottomSheet from "../../components/BottomSheet/BottomSheet";
import BottomSheetHeader from "../../components/BottomSheetHeader/BottomSheetHeader";
import FormInput from "../../components/FormInput/FormInput";
import formInputStyles from "../../components/FormInput/FormInputStyles";
import FormInputSheet from "../../components/FormInputSheet/FormInputSheet";
import SearchAutoCompleteItem from "../../components/SearchAutoCompleteItem/SearchAutoCompleteItem";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import { PHILIPPINES_REGION as INITIAL_COORDINATES } from "../../data/defaultLocation";

const Address = ({ isFocused = true }) => {
  const [coordinates, setCoordinates] = useState(INITIAL_COORDINATES);
  const [autoCompleteSearches, setAutoCompleteSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { listingState, setListingData } = useCreateListingContext();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();

  const onOpenModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const onMapPress = useCallback(async ({ nativeEvent: { coordinate } }) => {
    setCoordinates(coordinate);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    setIsLoading(true);

    // Get the needed address data
    try {
      const address = await Location.reverseGeocodeAsync(coordinate);
      const { name, district, city, region } = address[0];

      // Combine the address data
      const otherLocationData = [district, city, region]
        .filter(Boolean)
        .join(", ");
      const location = [name, otherLocationData].filter(Boolean).join(" ");

      toast.show("Address updated", {
        style: toastStyles.toastInsetFooter,
      });

      setListingData({ location });
    } catch (error) {
      Alert.alert("There was an error getting the address data.");
      console.log("Error getting address data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onAddressReset = useCallback(() => {
    toast.hideAll();
    toast.show("Reset address successfully", {
      type: "success",
      style: toastStyles.toastInsetBottom,
    });

    setListingData({ location: route.params.location });
    setCoordinates(INITIAL_COORDINATES);
  }, [route.params?.location, toast]);

  const headerRight = useCallback(() => {
    if (!route.params?.location) {
      return null;
    }

    // Check if the location has changed
    const isLocationChanged = listingState.location !== route.params.location;

    return (
      <Item
        title="Reset"
        onPress={onAddressReset}
        color={isLocationChanged ? "white" : "rgba(255,255,255,0.4)"}
        disabled={!isLocationChanged}
      />
    );
  }, [listingState.location, route.params?.location, onAddressReset]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  const renderAutoCompleteSearches = useCallback(() => {
    if (autoCompleteSearches.length === 0) {
      return null;
    }

    const renderItem = ({ item }) => (
      <SearchAutoCompleteItem
        item={item}
        onPress={() => {
          // Use item as search query
          setListingData({ location: item });

          // Remove all autocomplete suggestions
          setAutoCompleteSearches([]);

          /* Fetch results here */
          setIsModalVisible(false);
        }}
      />
    );

    return (
      <FlatList
        data={autoCompleteSearches}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
      />
    );
  }, [autoCompleteSearches]);

  useEffect(() => {
    if (isFocused) {
      toast.show("Please tap the map to select location", {
        style: toastStyles.toastInsetFooter,
      });
    }
  }, [isFocused]);

  const isInitialCoordinates =
    coordinates.latitude === INITIAL_COORDINATES.latitude &&
    coordinates.longitude === INITIAL_COORDINATES.longitude;

  return (
    <>
      <View style={globalStyles.flexFull}>
        {isFocused && (
          <MapView
            style={globalStyles.flexFull}
            initialRegion={coordinates}
            onPress={onMapPress}
            showsCompass={false}
          >
            {!isInitialCoordinates && (
              <Marker coordinate={coordinates} pinColor={Colors.red} />
            )}
          </MapView>
        )}

        <Pressable
          style={({ pressed }) => ({
            position: "absolute",
            left: 20,
            right: 20,
            top: 20,
            ...pressedOpacity(pressed, 0.8),
          })}
          onPress={onOpenModal}
        >
          <FormInput
            placeholder="Enter address"
            value={listingState.location}
            fieldStyle={{ backgroundColor: "white" }}
            containerStyle={{ pointerEvents: "none" }}
            trailingAccessory={
              isLoading ? (
                <ActivityIndicator style={formInputStyles.trailingIcon} />
              ) : null
            }
          />
        </Pressable>
      </View>

      <BottomSheet visible={isModalVisible} onDismiss={onCloseModal}>
        <BottomSheetHeader
          label="Address of your property"
          onClose={onCloseModal}
        />

        <View
          style={{
            ...style.sheetContainer,
            ...globalStyles.flexFull,
          }}
        >
          <FormInputSheet
            placeholder="Enter address"
            value={listingState.location}
            onChangeText={(value) => {
              setAutoCompleteSearches([value]);
              setListingData({ location: value });
            }}
            leadingAccessory={
              <Entypo
                name="location-pin"
                size={20}
                style={formInputStyles.leadingIcon}
              />
            }
          />

          <BottomSheetScrollView
            contentInset={{ bottom: insets.bottom }}
            keyboardShouldPersistTaps="handled"
          >
            {renderAutoCompleteSearches()}
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    </>
  );
};

export default Address;
