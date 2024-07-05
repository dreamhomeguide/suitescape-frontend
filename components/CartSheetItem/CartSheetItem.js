import { useNavigation } from "@react-navigation/native";
import { differenceInDays } from "date-fns";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { Text, View } from "react-native";
import { BorderlessButton, Swipeable } from "react-native-gesture-handler";
import { Checkbox } from "react-native-ui-lib";

import style from "./CartSheetItemStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import { useBookingData } from "../../contexts/BookingContext";
import { useCartContext, useCartData } from "../../contexts/CartContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useOnSwipeableWillOpen } from "../../contexts/SwipeableContext";
import { Routes } from "../../navigation/Routes";
import Stepper from "../Stepper/Stepper";

const CartSheetItem = ({ item, isAddon, isArchived }) => {
  const swipeRef = useRef(null);

  const {
    cartState,
    updateQuantity,
    addOrUpdateAddon,
    removeItem,
    removeArchived,
    selectItem,
    closeCart,
  } = useCartContext();
  const { listing } = useListingContext();
  const onSwipeableWillOpen = useOnSwipeableWillOpen(swipeRef);
  const navigation = useNavigation();
  const bookingData = useBookingData();
  const cartData = useCartData();

  const nights = useMemo(() => {
    if (!bookingData.startDate || !bookingData.endDate) {
      return 1;
    }

    return differenceInDays(bookingData.endDate, bookingData.startDate);
  }, [bookingData.endDate, bookingData.startDate]);

  const cartAddon = useMemo(() => {
    if (!isAddon) {
      return;
    }

    // Get addon data from cart
    const addon = cartData.addons.find((addon) => addon.id === item.id);
    if (!addon) {
      return {
        quantity: 0,
        maxQuantity: item.quantity,
      };
    }

    return addon;
  }, [cartData.addons, isAddon, item.quantity]);

  const renderRightActions = useCallback(() => {
    if (isAddon) {
      return null;
    }

    return (
      <BorderlessButton
        activeOpacity={0.8}
        onPress={() => {
          if (isArchived) {
            removeArchived({ listingId: listing.id, roomId: item.id });
          } else {
            removeItem({ listingId: listing.id, roomId: item.id });
          }
          swipeRef.current?.reset();
        }}
      >
        <View
          style={{
            ...globalStyles.swiperActionButton,
            backgroundColor: Colors.red,
          }}
        >
          <Text style={globalStyles.swiperActionText}>Delete</Text>
        </View>
      </BorderlessButton>
    );
  }, [isArchived, item.id, listing.id]);

  const isSelected = useMemo(
    () => cartData.selected.includes(item.id),
    [cartData.selected, item.id],
  );

  const onSelect = useCallback(() => {
    selectItem({ listingId: listing.id, roomId: item.id });
  }, [item.id, listing.id]);

  const onItemPress = useCallback(() => {
    closeCart();
    navigation.navigate(Routes.ROOM_DETAILS, { roomId: item.id });
  }, [navigation, item.id]);

  const onStepperChange = useCallback(
    (value) => {
      if (isAddon) {
        addOrUpdateAddon({
          listingId: listing.id,
          addonData: {
            id: item.id,
            name: item.name,
            price: item.price,
            maxQuantity: item.quantity,
            quantity: value,
          },
        });
        return;
      }

      // Remove item if quantity is less than 1
      if (value < 1) {
        removeItem({ listingId: listing.id, roomId: item.id });
        return;
      }

      updateQuantity({
        listingId: listing.id,
        roomId: item.id,
        newQuantity: value,
      });
    },
    [item.id, listing.id],
  );

  return (
    <Swipeable
      ref={swipeRef}
      onSwipeableWillOpen={onSwipeableWillOpen}
      renderRightActions={renderRightActions}
      overshootRight={false}
      containerStyle={{
        ...globalStyles.swiperContainer,
        ...(isArchived && { opacity: 0.5 }),
      }}
    >
      <View style={style.contentContainer}>
        <View style={style.content}>
          {cartState.isEditing && !isAddon && !isArchived && (
            <Checkbox
              value={isSelected}
              color={Colors.blue}
              onValueChange={onSelect}
            />
          )}

          <BorderlessButton
            onPress={onItemPress}
            enabled={!isAddon}
            style={globalStyles.flexFull}
          >
            <Text style={globalStyles.boldText} numberOfLines={1}>
              {item.name}
            </Text>
            <Text>
              ₱{item.price.toLocaleString()} * {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </Text>
          </BorderlessButton>
        </View>

        {!isArchived && (
          <Stepper
            value={isAddon ? cartAddon.quantity : item.quantity}
            maxValue={isAddon ? cartAddon.maxQuantity : item.maxQuantity}
            minValue={isAddon && 0}
            onValueChange={onStepperChange}
          />
        )}
      </View>
    </Swipeable>
  );
};

export default memo(CartSheetItem);
