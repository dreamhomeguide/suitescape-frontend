import amenitiesData from "../data/amenitiesData";
import bedsData from "../data/bedsData";
import placesNearbyData from "../data/placesNearbyData";

export const getTypeOfBedsValueText = (typeOfBeds) => {
  if (!typeOfBeds) {
    return "";
  }

  return Object.entries(typeOfBeds)
    .filter(([_key, value]) => value > 0) // Filter out beds with 0 count
    .map(([key, value]) => `${value} ${bedsData[key]}`)
    .join(", ");
};

export const getAmenitiesValueText = (amenities) => {
  if (!amenities) {
    return "";
  }

  return Object.keys(amenities)
    .filter((key) => amenities[key] && amenitiesData[key]) // Filter out amenities that are not selected
    .map((key) => amenitiesData[key].label)
    .join(", ");
};

export const getRoomsValueText = (rooms) => {
  if (!rooms) {
    return "";
  }

  return rooms.map((room) => room.category.name).join(", ");
};

export const getAddonsValueText = (addons) => {
  if (!addons) {
    return "";
  }

  return addons.map((addon) => addon.name).join(", ");
};

export const getNearbyPlacesValueText = (nearbyPlaces) => {
  if (!nearbyPlaces) {
    return "";
  }

  return Object.keys(nearbyPlaces)
    .filter((key) => nearbyPlaces[key])
    .map((key) => placesNearbyData[key].label)
    .join(", ");
};
