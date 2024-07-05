import { useScrollToTop } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import { FlatList, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import CartItem from "../../components/CartItem/CartItem";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar";
import { useActiveCarts, useExpiredCarts } from "../../contexts/CartContext";

const Cart = () => {
  // const { settings } = useSettings();
  const activeCarts = useActiveCarts();
  const expiredCarts = useExpiredCarts();

  const scrollViewRef = useRef(null);

  useScrollToTop(scrollViewRef);

  const renderCartItem = useCallback(({ item }) => {
    return <CartItem item={item} rooms={item.cart} />;
  }, []);

  const renderExpiredItem = useCallback(({ item }) => {
    return <CartItem item={item} rooms={item.archived} isExpired />;
  }, []);

  // if (settings.guestModeEnabled) {
  //   return (
  //     <View style={globalStyles.flexCenter}>
  //       <FocusAwareStatusBar style="dark" animated />
  //       <Text>Not logged in</Text>
  //     </View>
  //   );
  // }

  return (
    <View
      style={{
        ...globalStyles.flexFull,
        backgroundColor: Colors.backgroundGray,
      }}
    >
      <FocusAwareStatusBar style="dark" animated />
      <FlatList
        data={activeCarts}
        keyExtractor={(item) => item.listingData.id}
        renderItem={renderCartItem}
        contentContainerStyle={{ ...globalStyles.rowGap, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={globalStyles.flexCenter}>
            <Text style={globalStyles.emptyTextCenter}>
              No items in cart yet.
            </Text>
          </View>
        }
        ListFooterComponent={
          <FlatList
            data={expiredCarts}
            renderItem={renderExpiredItem}
            scrollEnabled={false}
          />
        }
      />
    </View>
  );
};

export default Cart;
