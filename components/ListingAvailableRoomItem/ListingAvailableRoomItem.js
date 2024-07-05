import { useNavigation } from "@react-navigation/native";
import React, { memo, useCallback } from "react";
import { Text, View } from "react-native";

import style from "./ListingAvailableRoomItemStyles";
import globalStyles from "../../assets/styles/globalStyles";
import amenitiesData from "../../data/amenitiesData";
import { Routes } from "../../navigation/Routes";
import Button from "../Button/Button";

const AMENITY_IN_VIEW = 3;

const ListingAvailableRoomItem = ({ item }) => {
  const { category, amenities } = item;

  const navigation = useNavigation();

  const handleView = useCallback(() => {
    navigation.navigate(Routes.ROOM_DETAILS, { roomId: item.id });
  }, [navigation, item.id]);

  return (
    <View style={style.mainContainer}>
      {/*<ImageBackground*/}
      {/*  source={img}*/}
      {/*  style={{*/}
      {/*    height: 200,*/}
      {/*    width: 'auto',*/}
      {/*    backgroundColor: 'lightgray',*/}
      {/*    borderRadius: 10,*/}
      {/*    marginBottom: 20,*/}
      {/*  }}>*/}
      {/*  <CouponBadge>50% Off</CouponBadge>*/}
      {/*</ImageBackground>*/}

      <View style={style.titleContainer}>
        <Text
          numberOfLines={1}
          style={{
            ...style.roomNameText,
            ...style.boldText,
          }}
        >
          {category.name}
        </Text>

        {/* This is causing virtualized list issues */}
        {/*<StarRatingView rating={average_rating} textStyle={{ fontSize: 14 }} />*/}
      </View>

      <View style={style.detailsContainer}>
        <View
          style={{ ...globalStyles.flexFull, ...globalStyles.containerGap }}
        >
          <Text
            style={{
              ...style.detailsTitleText,
              ...style.boldText,
            }}
          >
            Room Details
          </Text>
          <Text style={style.text}>
            <Text style={style.tagText}>Room Size:</Text> {category.floor_area}{" "}
            Sqm
          </Text>
          <Text style={style.text}>
            <Text style={style.tagText}>Good for:</Text> {category.pax}{" "}
            {category.pax > 1 ? "Persons" : "Person"}
          </Text>
          <Text style={style.text}>
            <Text style={style.tagText}>Available Rooms:</Text>{" "}
            {category.quantity}
          </Text>
        </View>

        <View
          style={{ ...globalStyles.flexFull, ...globalStyles.containerGap }}
        >
          <Text
            style={{
              ...style.detailsTitleText,
              ...style.boldText,
            }}
          >
            Amenities
          </Text>

          {amenities
            .slice(0, AMENITY_IN_VIEW)
            .map(({ id: amenityId, name }) => (
              <Text key={amenityId} style={style.text}>
                {amenitiesData[name].label}
              </Text>
            ))}

          {amenities.length > AMENITY_IN_VIEW && (
            <Text style={style.tagText}>Others...</Text>
          )}

          {amenities.length === 0 && <Text style={style.text}>None</Text>}
        </View>
      </View>

      <View style={globalStyles.horizontalDivider} />

      <View style={style.priceContainer}>
        <Text style={style.priceText}>Price Per Night</Text>
        <Text style={style.priceText}>
          ₱ {category.price?.toLocaleString()}
        </Text>
      </View>

      <View style={style.buttonContainer}>
        <Button
          outlined
          containerStyle={globalStyles.flexFull}
          onPress={handleView}
        >
          View Details
        </Button>
      </View>
    </View>
  );
};

export default memo(ListingAvailableRoomItem);
