import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "../../assets/Colors";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import AppHeader from "../../components/AppHeader/AppHeader";
import IconBadge from "../../components/IconBadge/IconBadge";
import ListingAvailableRoomItem from "../../components/ListingAvailableRoomItem/ListingAvailableRoomItem";
import useFetchAPI from "../../hooks/useFetchAPI";

const CheckAvailability = ({ route }) => {
  const listingId = route.params.listingId;
  const { data: rooms } = useFetchAPI(`/listings/${listingId}/rooms`);
  const insets = useSafeAreaInsets();

  return (
    <View style={globalStyles.flexFull}>
      <AppHeader title="Check Availability">
        <Pressable style={({ pressed }) => pressedOpacity(pressed, 0.3)}>
          <IconBadge count={0}>
            <FontAwesome5 name="shopping-cart" size={20} color={Colors.blue} />
          </IconBadge>
        </Pressable>
      </AppHeader>

      <FlatList
        data={rooms}
        contentInset={{ bottom: insets.bottom }}
        // contentContainerStyle={{
        //   paddingBottom: insets.bottom,
        // }}
        renderItem={({ item }) => <ListingAvailableRoomItem item={item} />}
        ListEmptyComponent={
          <ActivityIndicator style={globalStyles.loadingCircle} />
        }
      />
    </View>
  );
};

export default CheckAvailability;
