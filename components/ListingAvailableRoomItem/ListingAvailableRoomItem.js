import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./ListingAvailableRoomItemStyles";
import globalStyles from "../../assets/styles/globalStyles";
import amenitiesData from "../../data/amenitiesData";
import { Routes } from "../../navigation/Routes";
import Button from "../Button/Button";
import StarRatingView from "../StarRatingView/StarRatingView";

const AMENITY_IN_VIEW = 3;

const ListingAvailableRoomItem = ({ item }) => {
  const { id: roomId, category, average_rating, amenities } = item;
  const navigation = useNavigation();

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
        <StarRatingView rating={average_rating} textStyle={{ fontSize: 14 }} />
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
          {/*<Text style={style.text}>*/}
          {/*  Type of Bed:{' '}*/}
          {/*  <>*/}
          {/*    {Object.keys(category.type_of_beds).map(*/}
          {/*      (bedType, index, array) => (*/}
          {/*        <Text key={index}>*/}
          {/*          {capitalizedText(bedType)}*/}
          {/*          {index === array.length - 1 ? ' ' : ', '}*/}
          {/*        </Text>*/}
          {/*      ),*/}
          {/*    )}*/}
          {/*  </>*/}
          {/*</Text>*/}
          <Text style={style.text}>Room Size: {category.size} Sqm</Text>
          <Text style={style.text}>
            Good for: {category.pax} {category.pax > 1 ? "Persons" : "Person"}
          </Text>
          <Text style={style.text}>Others...</Text>
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
            <Text style={style.text}>Others...</Text>
          )}

          {amenities.length === 0 && <Text style={style.text}>None</Text>}
        </View>
      </View>

      <View style={globalStyles.horizontalDivider} />

      <View style={style.priceContainer}>
        <Text style={style.priceText}>Price Per Night</Text>
        <Text style={style.priceText}>₱ {category.price}</Text>
      </View>

      <View style={style.buttonsContainer}>
        <Button containerStyle={globalStyles.flexFull}>Add to Cart</Button>
        <Button
          outlined
          containerStyle={globalStyles.flexFull}
          onPress={() => navigation.navigate(Routes.ROOM_DETAILS, { roomId })}
        >
          View
        </Button>
      </View>
    </View>
  );
};

export default memo(ListingAvailableRoomItem);
