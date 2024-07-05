import { BottomSheetFlatList, BottomSheetFooter } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { differenceInDays } from "date-fns";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { FlatList, Text, View } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./CartSheetStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import { useBookingData } from "../../contexts/BookingContext";
import { useCartContext, useCartData } from "../../contexts/CartContext";
import { useListingContext } from "../../contexts/ListingContext";
import { SwipeableProvider } from "../../contexts/SwipeableContext";
import { useTimerContext } from "../../contexts/TimerContext";
import { Routes } from "../../navigation/Routes";
import formatRange from "../../utils/rangeFormatter";
import AppFooter from "../AppFooter/AppFooter";
import AppFooterDetails from "../AppFooterDetails/AppFooterDetails";
import BottomSheet from "../BottomSheet/BottomSheet";
import BottomSheetHeader from "../BottomSheetHeader/BottomSheetHeader";
import ButtonLarge from "../ButtonLarge/ButtonLarge";
import ButtonLink from "../ButtonLink/ButtonLink";
import CartSheetItem from "../CartSheetItem/CartSheetItem";

const CartSheet = () => {
  const {
    cartState,
    closeCart,
    toggleEditing,
    removeSelected,
    removeAllArchived,
    reserveAll,
    reservedSelected,
    unselectAll,
  } = useCartContext();

  const { listing } = useListingContext();
  const { pauseTimer } = useTimerContext();
  const bookingData = useBookingData();
  const cartData = useCartData();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const currentSwipeRef = useRef(null);

  const nights = useMemo(
    () => differenceInDays(bookingData.endDate, bookingData.startDate) || 1,
    [bookingData.endDate, bookingData.startDate],
  );

  const cartTotal = useMemo(
    () => (cartData.total + cartData.addonsTotal) * nights,
    [cartData.total, cartData.addonsTotal, nights],
  );

  const onToggleEdit = useCallback(() => {
    if (!listing?.id) {
      return;
    }
    currentSwipeRef.current?.reset();
    toggleEditing();
    unselectAll({ listingId: listing.id });
  }, [listing?.id]);

  const onChangeDates = useCallback(() => {
    closeCart();
    navigation.navigate({
      name: Routes.SELECT_DATES,
      merge: true,
    });
  }, [navigation]);

  const onCloseCart = useCallback(() => {
    if (!listing?.id) {
      return;
    }

    // Close cart and unselect all items
    closeCart();
    unselectAll({ listingId: listing.id });
  }, [listing?.id]);

  const onReserveRooms = useCallback(() => {
    if (!listing?.id) {
      return;
    }

    // If there are selected items, reserve only the selected items
    if (cartData.selected && cartData.selected.length > 0) {
      reservedSelected({ listingId: listing.id });
    } else {
      reserveAll({ listingId: listing.id });
    }

    // Pause timer when reserving rooms
    console.log("Pausing timer...");
    pauseTimer(listing.id);

    // Close cart and navigate to guest info screen
    closeCart();
    navigation.navigate(Routes.GUEST_INFO);
  }, [cartData.selected, listing?.id, navigation]);

  const renderCartItem = useCallback(
    ({ item }) => <CartSheetItem item={item} />,
    [],
  );

  const renderAddonItem = useCallback(
    ({ item }) => <CartSheetItem item={item} isAddon />,
    [],
  );

  const renderExpiredItem = useCallback(
    ({ item }) => <CartSheetItem item={item} isArchived />,
    [],
  );

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <AppFooter>
          {cartState.isEditing ? (
            <View style={globalStyles.buttonRow}>
              <ButtonLarge
                flexFull
                color={Colors.red}
                disabled={cartData.selected.length === 0}
                onPress={() => removeSelected({ listingId: listing?.id })}
              >
                Remove
              </ButtonLarge>
              <ButtonLarge
                flexFull
                disabled={cartData.selected.length === 0}
                onPress={onReserveRooms}
              >
                Reserve
              </ButtonLarge>
            </View>
          ) : (
            <AppFooterDetails
              buttonLabel="Reserve All"
              buttonProps={{ disabled: cartData.cart.length === 0 }}
              buttonOnPress={onReserveRooms}
            >
              <View style={{ ...globalStyles.textGap, alignItems: "center" }}>
                <Text style={style.priceText}>
                  ₱{cartTotal.toLocaleString()}
                </Text>
                <Text style={{ ...style.totalText, color: Colors.gray }}>
                  Total
                </Text>
              </View>
            </AppFooterDetails>
          )}
        </AppFooter>
      </BottomSheetFooter>
    ),
    [
      cartState.isEditing,
      cartData.selected,
      cartTotal,
      listing?.id,
      onReserveRooms,
    ],
  );

  return (
    <BottomSheet
      visible={cartState.isVisible}
      onDismiss={onCloseCart}
      footerComponent={renderFooter}
    >
      <BottomSheetHeader label="Cart" onClose={onCloseCart}>
        <BorderlessButton onPress={onToggleEdit}>
          <Text style={style.editButton}>
            {cartState.isEditing ? "Done" : "Edit"}
          </Text>
        </BorderlessButton>
      </BottomSheetHeader>

      <SwipeableProvider value={{ currentSwipeRef }}>
        <BottomSheetFlatList
          data={cartData.cart}
          renderItem={renderCartItem}
          contentContainerStyle={style.list}
          contentInset={{ bottom: insets.bottom }}
          onScrollBeginDrag={() => currentSwipeRef.current?.close()}
          ListEmptyComponent={
            <Text style={globalStyles.emptyTextCenter}>
              No items in the cart yet.
            </Text>
          }
          ListHeaderComponent={
            <View style={style.header}>
              <Text style={{ ...globalStyles.headerText, color: Colors.blue }}>
                {listing?.name}
              </Text>
              {bookingData.startDate && bookingData.endDate && (
                <View style={style.headerDates}>
                  <Text style={{ color: Colors.gray }}>
                    {`Date: ${formatRange(bookingData.startDate, bookingData.endDate)} `}
                    {`(${differenceInDays(bookingData.endDate, bookingData.startDate)} ${nights === 1 ? "night" : "nights"})`}
                  </Text>

                  <ButtonLink onPress={onChangeDates} type="text">
                    Change
                  </ButtonLink>
                </View>
              )}
            </View>
          }
          ListFooterComponent={
            <View style={globalStyles.largeContainerGap}>
              {listing?.addons.length > 0 && (
                <View style={globalStyles.rowGap}>
                  <View style={style.headerRow}>
                    <Text style={globalStyles.boldText}>Add-ons</Text>
                  </View>

                  <FlatList
                    data={listing.addons}
                    renderItem={renderAddonItem}
                    scrollEnabled={false}
                    style={globalStyles.largeContainerGap}
                  />
                </View>
              )}

              {cartData.archived.length > 0 && (
                <View style={globalStyles.rowGap}>
                  <View style={style.headerRow}>
                    <Text style={globalStyles.boldText}>Expired Items</Text>
                    <BorderlessButton
                      onPress={() =>
                        removeAllArchived({ listingId: listing?.id })
                      }
                    >
                      <Text style={{ color: Colors.gray }}>Clear</Text>
                    </BorderlessButton>
                  </View>

                  <FlatList
                    data={cartData.archived}
                    renderItem={renderExpiredItem}
                    scrollEnabled={false}
                    style={globalStyles.largeContainerGap}
                  />
                </View>
              )}
            </View>
          }
        />
      </SwipeableProvider>
    </BottomSheet>
  );
};

export default memo(CartSheet);
