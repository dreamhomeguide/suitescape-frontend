import { useNavigation } from "@react-navigation/native";
import { differenceInDays } from "date-fns";
import { Image } from "expo-image";
import React, { memo, useCallback, useMemo } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

import style from "./CartItemStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import { useBookingContext } from "../../contexts/BookingContext";
import { useCartContext } from "../../contexts/CartContext";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import formatRange from "../../utils/rangeFormatter";
import Button from "../Button/Button";
import ReadMore from "../ReadMore/ReadMore";

const MAX_ROOMS_TO_SHOW = 3;

const CartItem = ({ item, rooms, isExpired }) => {
  const { bookingState } = useBookingContext();
  const { clearCart, removeAllArchived } = useCartContext();
  const navigation = useNavigation();
  const toast = useToast();

  const booking = useMemo(
    () => bookingState.listings[item.listingData.id],
    [bookingState.listings, item.listingData.id],
  );

  const nights = useMemo(
    () => differenceInDays(booking?.endDate, booking?.startDate) || 1,
    [booking?.endDate, booking?.startDate],
  );

  const cartItemDates = useMemo(() => {
    if (booking?.startDate && booking?.endDate) {
      return `${formatRange(booking.startDate, booking.endDate)} (${nights} ${
        nights === 1 ? "night" : "nights"
      })`;
    }
  }, [booking?.startDate, booking?.endDate, nights]);

  const cartItemTotal = useMemo(() => {
    return item.total * nights;
  }, [item.total, nights]);

  // const renderRooms = useCallback(() => {
  //   const slicedRooms = item.cart.slice(0, MAX_ROOMS_TO_SHOW);
  //   const roomTexts = [];
  //
  //   for (const room of slicedRooms) {
  //     roomTexts.push(
  //       <Text key={room.id}>
  //         {room.name} -{" "}
  //         {room.price?.toLocaleString("en-PH", {
  //           style: "currency",
  //           currency: "PHP",
  //         })}
  //       </Text>,
  //     );
  //   }
  //
  //   if (item.cart.length > MAX_ROOMS_TO_SHOW) {
  //     roomTexts.push(
  //       <Text key="more" style={{ color: Colors.blue }}>
  //         +{item.cart.length - MAX_ROOMS_TO_SHOW} more
  //       </Text>,
  //     );
  //   }
  //
  //   return roomTexts;
  // }, [item.cart]);

  const onViewDetails = useCallback(() => {
    navigation.navigate(Routes.LISTING_DETAILS, {
      listingId: item.listingData.id,
    });
  }, [navigation, item.listingData.id]);

  const cartRooms = useMemo(
    () =>
      rooms
        .map(
          (cartItem) =>
            `${cartItem.quantity}x ${cartItem.name} - ₱${cartItem.price.toLocaleString()}`,
        )
        .join("\n"),
    [rooms],
  );

  const removeCartItem = useCallback(() => {
    Alert.alert(
      "Remove Cart Item",
      "Are you sure you want to remove this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            if (isExpired) {
              removeAllArchived({ listingId: item.listingData.id });
            } else {
              clearCart({ listingId: item.listingData.id });
            }

            toast.show("Item removed", {
              type: "success",
              style: toastStyles.toastInsetFooter,
            });
          },
        },
      ],
    );
  }, [isExpired, item.listingData.id, toast]);

  return (
    <Pressable
      onLongPress={removeCartItem}
      style={({ pressed }) => ({
        ...style.container,
        opacity: isExpired ? 0.5 : 1,
        ...pressedOpacity(pressed, 0.3),
      })}
    >
      <View style={globalStyles.largeContainerGap}>
        <Image
          source={{ uri: baseURL + item.listingData.image }}
          style={globalStyles.coverImage}
        />

        <View style={globalStyles.textGap}>
          <Text style={style.header} numberOfLines={1}>
            {item.listingData.name}
          </Text>
          <Text style={style.subHeader}>{cartItemDates}</Text>
        </View>

        <View style={globalStyles.textGap}>
          <Text style={{ color: "rgba(0,0,0,0.5)" }}>Rooms:</Text>
          <ReadMore numberOfLines={MAX_ROOMS_TO_SHOW}>{cartRooms}</ReadMore>
        </View>

        {!isExpired && (
          <>
            <View style={globalStyles.horizontalDivider} />

            <View style={style.priceContainer}>
              <Text style={style.priceText}>Total:</Text>
              <Text style={style.priceText}>
                ₱{cartItemTotal.toLocaleString()}
              </Text>
            </View>
          </>
        )}
      </View>

      <Button containerStyle={style.button} onPress={onViewDetails}>
        View Details
      </Button>
    </Pressable>
  );
};

export default memo(CartItem);
