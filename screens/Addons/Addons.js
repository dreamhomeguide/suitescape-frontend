import React, { useCallback } from "react";
import { FlatList, View } from "react-native";

import style from "./AddonsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import CartSheetItem from "../../components/CartSheetItem/CartSheetItem";
import { useListingContext } from "../../contexts/ListingContext";
import { Routes } from "../../navigation/Routes";

const Addons = ({ navigation }) => {
  const { listing } = useListingContext();

  const renderItem = useCallback(
    ({ item }) => <CartSheetItem item={item} isAddon />,
    [],
  );

  const onContinue = useCallback(() => {
    navigation.navigate(Routes.GUEST_INFO);
  }, [navigation]);

  return (
    <>
      <FlatList
        data={listing.addons}
        renderItem={renderItem}
        contentContainerStyle={style.contentContainer}
      />

      <AppFooter>
        <View style={globalStyles.buttonRow}>
          <View style={globalStyles.flexFull}>
            <ButtonLarge onPress={onContinue}>Continue</ButtonLarge>
          </View>
        </View>
      </AppFooter>
    </>
  );
};

export default Addons;
