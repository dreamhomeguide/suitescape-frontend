// noinspection JSCheckFunctionSignatures

import { createContext, useContext, useMemo, useReducer } from "react";

import { isEmptyField } from "../utils/emptyFieldChecker";

export const MAXIMUM_STAY_HOURS = 24;
export const MINIMUM_STAY_HOURS = 18;

const initialState = {
  name: "",
  location: "",
  description: "",
  facilityType: "",
  checkInTime: "",
  checkOutTime: "",
  isCheckInOutSameDay: false,
  totalHours: -1,
  adultCapacity: -1,
  childCapacity: -1,
  isPetFriendly: false,
  parkingLot: false,
  isEntirePlace: null,
  entirePlaceWeekdayPrice: null,
  entirePlaceWeekendPrice: null,
  rooms: [],
  images: [],
  videos: [],
  addons: [],
  nearbyPlaces: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LISTING_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "SYNC_TRANSCODE_PROGRESS":
      return {
        ...state,
        videos: state.videos.map((video) =>
          action.payload[video.id]
            ? {
                ...video,
                transcodeProgress: action.payload[video.id],
              }
            : video,
        ),
      };
    case "CLEAR_LISTING_INFO":
      return initialState;
    default:
      return state;
  }
};

export const CreateListingContext = createContext({
  listingState: initialState,
  setListingData: (_payload) => {},
  syncTranscodeProgress: (_payload) => {},
  clearListingInfo: () => {},
});

export const CreateListingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const actions = {
    setListingData: (payload) =>
      dispatch({
        type: "SET_LISTING_DATA",
        payload,
      }),
    syncTranscodeProgress: (payload) =>
      dispatch({
        type: "SYNC_TRANSCODE_PROGRESS",
        payload,
      }),
    clearListingInfo: () =>
      dispatch({
        type: "CLEAR_LISTING_INFO",
      }),
  };

  const createListingContext = {
    listingState: state,
    ...actions,
  };

  return (
    <CreateListingContext.Provider value={createListingContext}>
      {children}
    </CreateListingContext.Provider>
  );
};

export const useValidation = (currentPage) => {
  const { listingState } = useCreateListingContext();

  const validationRules = {
    0: () => !isEmptyField(listingState.facilityType),
    1: () => !isEmptyField(listingState.isEntirePlace),
    2: () => !isEmptyField(listingState.name),
    // (listingState.isEntirePlace
    //   ? !isEmptyField(listingState.entirePlacePrice)
    //   : true),
    3: () =>
      !isEmptyField(listingState.checkInTime) &&
      !isEmptyField(listingState.checkOutTime) &&
      listingState.totalHours >= MINIMUM_STAY_HOURS &&
      listingState.totalHours <= MAXIMUM_STAY_HOURS &&
      (listingState.isEntirePlace
        ? !isEmptyField(listingState.entirePlaceWeekdayPrice) &&
          !isEmptyField(listingState.entirePlaceWeekendPrice) &&
          !isEmptyField(listingState.adultCapacity) &&
          !isEmptyField(listingState.childCapacity)
        : true),
    4: () =>
      listingState.isEntirePlace
        ? listingState.images.length > 0
        : listingState.rooms.length > 0,
    5: () =>
      listingState.isEntirePlace
        ? listingState.videos.length > 0
        : listingState.images.length > 0,
    6: () =>
      listingState.isEntirePlace
        ? !isEmptyField(listingState.location)
        : listingState.videos.length > 0,
    7: () =>
      listingState.isEntirePlace ? true : !isEmptyField(listingState.location),
    8: () => true,
    9: () => !listingState.isEntirePlace,
  };

  return useMemo(() => {
    const validate = validationRules[currentPage];
    return validate ? validate() : false;
  }, [currentPage, listingState]);
};

export const useCreateListingContext = () => {
  const context = useContext(CreateListingContext);
  if (context === undefined) {
    throw new Error(
      "useCreateListingContext must be used within a CreateListingProvider",
    );
  }
  return context;
};
