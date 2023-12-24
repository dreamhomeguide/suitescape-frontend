import React, { useCallback, useLayoutEffect } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { Colors } from "../../assets/Colors";
import Fontello from "../../assets/fontello/Fontello";
import globalStyles from "../../assets/styles/globalStyles";
import IconBadge from "../../components/IconBadge/IconBadge";
import ListingAvailableRoomItem from "../../components/ListingAvailableRoomItem/ListingAvailableRoomItem";
import useFetchAPI from "../../hooks/useFetchAPI";

const CheckAvailability = ({ navigation, route }) => {
  const listingId = route.params.listingId;
  const { data: rooms } = useFetchAPI(`/listings/${listingId}/rooms`);
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            title="shopping-cart"
            renderButton={() => (
              <IconBadge count={0}>
                <Fontello name="cart-solid" size={23} color={Colors.blue} />
              </IconBadge>
            )}
            onPress={() => console.log("Shopping cart pressed")}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }) => <ListingAvailableRoomItem item={item} />,
    [],
  );

  return (
    <FlatList
      data={rooms}
      contentInset={{ bottom: insets.bottom }}
      // contentContainerStyle={{
      //   paddingBottom: insets.bottom,
      // }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={globalStyles.bottomGap} />}
      ListEmptyComponent={() => (
        <ActivityIndicator style={globalStyles.loadingCircle} />
      )}
    />
  );
};

export default CheckAvailability;
