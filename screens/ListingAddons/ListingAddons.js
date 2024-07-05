import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { FlatList, Text, View } from "react-native";
import { Item } from "react-navigation-header-buttons";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ListingAddonItem from "../../components/ListingAddonItem/ListingAddonItem";
import ListingAddonSheet from "../../components/ListingAddonSheet/ListingAddonSheet";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import { SwipeableProvider } from "../../contexts/SwipeableContext";
import { checkEmptyFieldsObj } from "../../utils/emptyFieldChecker";

const initialState = {
  id: Date.now(),
  name: "",
  price: "",
  description: "",
  quantity: -1,
  is_consumable: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLEAR_ADDON_DATA":
      return { ...initialState, id: Date.now() };
    case "SET_ADDON_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const ListingAddons = ({ isFocused = true }) => {
  const [currentAddon, dispatch] = useReducer(reducer, initialState, undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const currentSwipeRef = useRef(null);

  const { listingState, setListingData } = useCreateListingContext();
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();

  const addonActions = useMemo(
    () => ({
      setCurrentAddon: (payload) =>
        dispatch({ type: "SET_ADDON_DATA", payload }),
      clearCurrentAddon: () => dispatch({ type: "CLEAR_ADDON_DATA" }),
    }),
    [],
  );

  const onOpenModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setIsEditing(false);
    addonActions.clearCurrentAddon();
  }, []);

  const onDeleteAddon = useCallback(
    (addonId) => {
      setListingData({
        addons: listingState.addons.filter((addon) => addon.id !== addonId),
      });

      addonActions.clearCurrentAddon();
      onCloseModal();
    },
    [listingState.addons],
  );

  const onEditAddon = useCallback((addon) => {
    setIsEditing(true);
    addonActions.setCurrentAddon(addon);
    onOpenModal();
  }, []);

  const onAddAddon = useCallback(() => {
    let isExists = false;

    // Update addon if it exists
    const updatedAddons = listingState.addons.map((addon) => {
      if (addon.id === currentAddon.id) {
        isExists = true;
        return currentAddon;
      }
      return addon;
    });

    // If no addon was updated, add a new addon
    if (!isExists) {
      updatedAddons.push(currentAddon);
    }

    setListingData({ addons: updatedAddons });
    addonActions.clearCurrentAddon();
    onCloseModal();
  }, [currentAddon, listingState.addons]);

  const isFooterButtonDisabled = useMemo(
    () =>
      checkEmptyFieldsObj(currentAddon, [
        "description",
        !currentAddon.is_consumable && "quantity", // If not consumable, quantity is not required
      ]),
    [currentAddon],
  );

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <AppFooter>
          <View style={globalStyles.buttonRow}>
            {isEditing && (
              <ButtonLarge
                flexFull
                color={Colors.red}
                onPress={() => {
                  onDeleteAddon(currentAddon.id);
                }}
              >
                Delete
              </ButtonLarge>
            )}
            <ButtonLarge
              flexFull
              disabled={isFooterButtonDisabled}
              onPress={() => onAddAddon()}
            >
              Save Changes
            </ButtonLarge>
          </View>
        </AppFooter>
      </BottomSheetFooter>
    ),
    [
      currentAddon.id,
      isEditing,
      isFooterButtonDisabled,
      onAddAddon,
      onDeleteAddon,
    ],
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <ListingAddonItem
          item={item}
          onPress={() => onEditAddon(item)}
          onDelete={() => onDeleteAddon(item.id)}
        />
      );
    },
    [onDeleteAddon, onEditAddon],
  );

  const headerRight = useCallback(() => {
    return (
      <Item
        title="Add-ons"
        onPress={onOpenModal}
        IconComponent={MaterialCommunityIcons}
        iconName="plus"
        color="white"
        iconSize={25}
      />
    );
  }, []);

  useLayoutEffect(() => {
    if (isFocused && isScreenFocused) {
      navigation.setOptions({
        headerRight,
      });
    }

    return () => {
      navigation.setOptions({
        headerRight: undefined,
      });
    };
  }, [headerRight, isFocused, isScreenFocused, navigation]);

  return (
    <>
      <View style={globalStyles.flexFull}>
        <SwipeableProvider value={{ currentSwipeRef }}>
          <FlatList
            data={listingState.addons}
            renderItem={renderItem}
            contentContainerStyle={style.contentContainer}
            ListEmptyComponent={
              <View style={globalStyles.flexCenter}>
                <Text style={globalStyles.emptyTextCenter}>
                  No add-ons added yet.
                </Text>
              </View>
            }
          />
        </SwipeableProvider>
      </View>

      <ListingAddonSheet
        isVisible={isModalVisible}
        currentAddon={currentAddon}
        onAddonChange={addonActions.setCurrentAddon}
        onClose={onCloseModal}
        headerLabel={isEditing ? "Edit Add-on" : "Add New Add-on"}
        footerComponent={renderFooter}
      />
    </>
  );
};

export default ListingAddons;
