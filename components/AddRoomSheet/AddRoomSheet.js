import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import _ from "lodash";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Alert, Pressable } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "../../assets/styles/createListingStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import { useAddRoomContext } from "../../contexts/AddRoomContext";
import amenitiesData from "../../data/amenitiesData";
import bedsData from "../../data/bedsData";
import { checkEmptyFieldsObj } from "../../utils/emptyFieldChecker";
import {
  getAmenitiesValueText,
  getTypeOfBedsValueText,
} from "../../utils/getValueText";
import BottomSheet from "../BottomSheet/BottomSheet";
import BottomSheetHeader from "../BottomSheetHeader/BottomSheetHeader";
import FormInputSheet from "../FormInputSheet/FormInputSheet";
import FormStepper from "../FormStepper/FormStepper";
import ListingFeaturesView, {
  FEATURES,
} from "../ListingFeaturesView/ListingFeaturesView";
import ListingPriceInput from "../ListingPriceInput/ListingPriceInput";

const AddRoomSheet = forwardRef(
  (
    {
      index,
      isVisible,
      currentRoom,
      onPageChange,
      onClose,
      headerLabel,
      footerComponent,
    },
    pagerViewRef,
  ) => {
    const prevRoomRef = useRef(null);

    const { setRoomCategory, setRoomAmenities, setRoomRule } =
      useAddRoomContext();
    const insets = useSafeAreaInsets();

    useEffect(() => {
      // Save the current room reference
      prevRoomRef.current = isVisible ? currentRoom : null;
    }, [isVisible]);

    const isNotChanged = useMemo(() => {
      if (!currentRoom.category || !prevRoomRef.current) {
        return true;
      }

      // Check if the current room is empty or not
      const roomEmpty =
        checkEmptyFieldsObj(currentRoom.category, ["type_of_beds"], true) &&
        checkEmptyFieldsObj(currentRoom.category.type_of_beds, null, true);

      return (
        index > 0 || roomEmpty || _.isEqual(currentRoom, prevRoomRef.current)
      );
    }, [currentRoom.category, index]);

    const typeOfBedsValueText = useMemo(
      () => getTypeOfBedsValueText(currentRoom.category.type_of_beds),
      [currentRoom.category.type_of_beds],
    );

    const amenitiesValueText = useMemo(
      () => getAmenitiesValueText(currentRoom.amenities),
      [currentRoom.amenities],
    );

    const roomAmenities = useMemo(
      () =>
        Object.keys(amenitiesData).map((key) => ({
          name: key,
          isSelected: currentRoom.amenities[key],
          onPress: () =>
            setRoomAmenities({
              [key]: !currentRoom.amenities[key],
            }),
        })),
      [currentRoom.amenities],
    );

    const renderRoomStepper = useCallback(
      ([key, value]) => (
        <FormStepper
          key={key}
          label={value}
          placeholder={value}
          value={currentRoom.category.type_of_beds[key]}
          onValueChange={(value) => {
            setRoomCategory({
              type_of_beds: {
                ...currentRoom.category.type_of_beds,
                [key]: value,
              },
            });
          }}
          useFormInputSheet
        />
      ),
      [currentRoom.category.type_of_beds],
    );

    const handleHeaderClose = useCallback(() => {
      if (isNotChanged) {
        onClose();
        return;
      }

      Alert.alert(
        "Discard Changes?",
        "Are you sure you want to discard changes?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: onClose,
          },
        ],
      );
    }, [isNotChanged, onClose]);

    return (
      <BottomSheet
        visible={isVisible}
        footerComponent={footerComponent}
        enablePanDownToClose={isNotChanged}
        dismissOnBackdropPress={isNotChanged}
        onDismiss={onClose}
        fullScreen
      >
        <BottomSheetHeader label={headerLabel} onClose={handleHeaderClose} />

        <PagerView
          ref={pagerViewRef}
          scrollEnabled={false}
          style={globalStyles.flexFull}
        >
          {/* Main Page */}
          <BottomSheetScrollView
            key="main"
            contentContainerStyle={style.sheetContainer}
            contentInset={{ bottom: insets.bottom }}
          >
            <FormInputSheet
              label="Room Name"
              placeholder="Enter room name"
              value={currentRoom.category.name}
              autoCorrect={false}
              autoCapitalize="words"
              onChangeText={(value) => setRoomCategory({ name: value })}
            />

            <FormInputSheet
              type="textarea"
              label="Description (Optional)"
              placeholder="Enter room description"
              value={currentRoom.category.description}
              onChangeText={(value) => setRoomCategory({ description: value })}
            />

            <FormStepper
              label="Floor Area (sqm)"
              placeholder="Floor Area"
              value={currentRoom.category.floor_area}
              onValueChange={(value) => setRoomCategory({ floor_area: value })}
              useFormInputSheet
            />

            <FormStepper
              label="Pax"
              placeholder="Pax"
              value={currentRoom.category.pax}
              onValueChange={(value) => setRoomCategory({ pax: value })}
              useFormInputSheet
            />

            <Pressable
              style={({ pressed }) => pressedOpacity(pressed)}
              onPress={() => onPageChange?.(1)}
            >
              <FormInputSheet
                label="Type of Beds"
                placeholder="Select type of beds"
                value={typeOfBedsValueText}
                containerStyle={{ pointerEvents: "none" }}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => pressedOpacity(pressed)}
              onPress={() => onPageChange?.(2)}
            >
              <FormInputSheet
                label="Amenities"
                placeholder="Select amenities"
                value={amenitiesValueText}
                containerStyle={{ pointerEvents: "none" }}
              />
            </Pressable>

            <FormInputSheet
              type="textarea"
              label="Room Rules"
              placeholder="Enter room rules"
              value={currentRoom.rule.content}
              onChangeText={(value) => setRoomRule(value)}
            />

            <ListingPriceInput
              weekDayPrice={currentRoom.category.weekday_price}
              weekendPrice={currentRoom.category.weekend_price}
              onWeekdayPriceChange={(value) =>
                setRoomCategory({ weekday_price: value })
              }
              onWeekendPriceChange={(value) =>
                setRoomCategory({ weekend_price: value })
              }
            />

            <FormStepper
              label="Number of Rooms"
              placeholder="Enter number of rooms"
              value={currentRoom.category.quantity}
              onValueChange={(value) => setRoomCategory({ quantity: value })}
              useFormInputSheet
            />
          </BottomSheetScrollView>

          {/* Type Of Beds */}
          <BottomSheetScrollView
            key="type_of_beds"
            contentContainerStyle={style.sheetContainer}
            contentInset={{ bottom: insets.bottom }}
            style={{ opacity: index === 1 ? 1 : 0.3 }} // Only works on Android
          >
            {Object.entries(bedsData).map(renderRoomStepper)}
          </BottomSheetScrollView>

          {/* Amenities */}
          <BottomSheetScrollView
            key="amenities"
            contentContainerStyle={style.sheetContainer}
            contentInset={{ bottom: insets.bottom }}
            style={{ opacity: index === 2 ? 1 : 0.3 }} // Only works on Android
          >
            <ListingFeaturesView
              data={roomAmenities}
              feature={FEATURES.amenities}
              fullMode={false}
            />
          </BottomSheetScrollView>
        </PagerView>
      </BottomSheet>
    );
  },
);

export default memo(AddRoomSheet);
