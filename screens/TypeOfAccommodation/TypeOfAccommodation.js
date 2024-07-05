import React, { useCallback } from "react";
import { FlatList } from "react-native";

import style from "../../assets/styles/createListingStyles";
import TypeAccommodationItem from "../../components/TypeAccommodationItem/TypeAccommodationItem";
import { useCreateListingContext } from "../../contexts/CreateListingContext";

export const accommodationTypes = [
  {
    label: "Entire Place",
    description:
      "Guests have sole access to the entire property, including all rooms and amenities.",
    value: true,
  },
  {
    label: "Multiple Rooms",
    description:
      "Guests have exclusive access to the room, along with its amenities.",
    value: false,
  },
];

const TypeOfAccommodation = () => {
  const { listingState, setListingData } = useCreateListingContext();

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = listingState.isEntirePlace === item.value;
      return (
        <TypeAccommodationItem
          item={item}
          isSelected={isSelected}
          onPress={() =>
            setListingData({ isEntirePlace: isSelected ? null : item.value })
          }
        />
      );
    },
    [listingState.isEntirePlace],
  );

  return (
    <FlatList
      data={accommodationTypes}
      renderItem={renderItem}
      contentContainerStyle={style.contentContainer}
    />
  );
};

export default TypeOfAccommodation;
