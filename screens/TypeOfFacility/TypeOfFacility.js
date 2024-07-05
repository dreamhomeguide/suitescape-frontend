import React, { useCallback } from "react";
import { FlatList } from "react-native";

import Apartment from "../../assets/images/svgs/facilities/apartment.svg";
import Cabin from "../../assets/images/svgs/facilities/cabin.svg";
import Condominium from "../../assets/images/svgs/facilities/condominium.svg";
import Hotel from "../../assets/images/svgs/facilities/hotel.svg";
import House from "../../assets/images/svgs/facilities/house.svg";
import Villa from "../../assets/images/svgs/facilities/villa.svg";
import style from "../../assets/styles/createListingStyles";
import TypeFacilityItem from "../../components/TypeFacilityItem/TypeFacilityItem";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import facilityData from "../../data/facilityData";

const ICON_SIZE = 75;

export const facilityTypes = [
  {
    label: facilityData.house,
    icon: <House width={ICON_SIZE} height={ICON_SIZE} />,
    value: "house",
  },
  {
    label: facilityData.hotel,
    icon: <Hotel width={ICON_SIZE} height={ICON_SIZE} />,
    value: "hotel",
  },
  {
    label: facilityData.apartment,
    icon: <Apartment width={ICON_SIZE} height={ICON_SIZE} />,
    value: "apartment",
  },
  {
    label: facilityData.condominium,
    icon: <Condominium width={ICON_SIZE} height={ICON_SIZE} />,
    value: "condominium",
  },
  {
    label: facilityData.cabin,
    icon: <Cabin width={ICON_SIZE} height={ICON_SIZE} />,
    value: "cabin",
  },
  {
    label: facilityData.villa,
    icon: <Villa width={ICON_SIZE} height={ICON_SIZE} />,
    value: "villa",
  },
];

const TypeOfFacility = () => {
  const { listingState, setListingData } = useCreateListingContext();

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = listingState.facilityType === item.value;
      return (
        <TypeFacilityItem
          item={item}
          isSelected={isSelected}
          onPress={() =>
            setListingData({ facilityType: isSelected ? null : item.value })
          }
        />
      );
    },
    [listingState.facilityType],
  );

  return (
    <FlatList
      data={facilityTypes}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={style.contentContainer}
      columnWrapperStyle={style.columnWrapper}
    />
  );
};

export default TypeOfFacility;
