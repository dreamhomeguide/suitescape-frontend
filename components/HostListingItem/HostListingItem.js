import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { memo, useCallback, useRef } from "react";
import { Alert, Text, View } from "react-native";
import {
  BorderlessButton,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";

import style from "./HostListingItemStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import { useListingContext } from "../../contexts/ListingContext";
import { useOnSwipeableWillOpen } from "../../contexts/SwipeableContext";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import { deleteListing } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import Chip from "../Chip/Chip";
import StarRatingView from "../StarRatingView/StarRatingView";

const HostListingItem = ({ item }) => {
  const {
    images: [coverImage],
  } = item || {};

  const swipeRef = useRef(null);

  const { setListing } = useListingContext();
  const onSwipeableWillOpen = useOnSwipeableWillOpen(swipeRef);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const deleteListingMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log(res);

          await queryClient.invalidateQueries({
            queryKey: ["host", "listings"],
          });

          swipeRef.current?.reset();

          Alert.alert("Listing deleted successfully.");
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const onDeleteListing = useCallback(() => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            if (!deleteListingMutation.isPending) {
              deleteListingMutation.mutate({ listingId: item.id });
            }
          },
        },
      ],
    );
  }, [deleteListingMutation, item.id]);

  const renderRightActions = useCallback(() => {
    return (
      <BorderlessButton activeOpacity={0.8} onPress={onDeleteListing}>
        <View
          style={{
            ...globalStyles.swiperActionButton,
            // backgroundColor: Colors.red,
          }}
        >
          <Text style={globalStyles.swiperActionText}>Delete Listing</Text>
        </View>
      </BorderlessButton>
    );
  }, [onDeleteListing]);

  return (
    <>
      <Swipeable
        ref={swipeRef}
        onSwipeableWillOpen={onSwipeableWillOpen}
        renderRightActions={renderRightActions}
        overshootRight={false}
        containerStyle={globalStyles.swiperContainer}
      >
        <RectButton
          style={style.mainContainer}
          onPress={() =>
            navigation.navigate(Routes.LISTING_DETAILS, { listingId: item.id })
          }
        >
          {coverImage && (
            <Image
              source={{ uri: baseURL + coverImage.url }}
              style={style.image}
            />
          )}

          <View style={style.contentContainer}>
            <Text style={style.label}>{item.name}</Text>
            <Text style={style.text} numberOfLines={2}>
              Location: {item.location}
            </Text>
            <StarRatingView rating={item.average_rating} />

            {item.is_entire_place ? (
              <Chip textStyle={style.text}>Entire Place</Chip>
            ) : null}
          </View>

          <BorderlessButton
            onPress={() =>
              navigation.navigate(Routes.EDIT_LISTING, { listingId: item.id })
            }
            style={style.button}
            disallowInterruption
          >
            <MaterialCommunityIcons
              name="pencil"
              size={22}
              color={Colors.blue}
            />
          </BorderlessButton>

          <BorderlessButton
            onPress={() => {
              if (item.is_entire_place) {
                navigation.navigate(Routes.CALENDAR, {
                  id: item.id,
                  type: "entirePlace",
                });
              } else {
                navigation.navigate(Routes.CALENDAR_ROOMS, {
                  listingId: item.id,
                });
                setListing(item);
              }
            }}
            style={style.button}
            disallowInterruption
          >
            <MaterialCommunityIcons
              name="calendar"
              size={22}
              color={Colors.blue}
            />
          </BorderlessButton>
        </RectButton>
      </Swipeable>

      <View
        style={{
          ...globalStyles.swiperBackground,
          backgroundColor: Colors.red,
        }}
      />
    </>
  );
};

export default memo(HostListingItem);
