import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
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
import AddRoomItem from "../../components/AddRoomItem/AddRoomItem";
import AddRoomSheet from "../../components/AddRoomSheet/AddRoomSheet";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import { AddRoomProvider } from "../../contexts/AddRoomContext";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import { SwipeableProvider } from "../../contexts/SwipeableContext";
import bedsData from "../../data/bedsData";
import { fetchListingRooms } from "../../services/apiService";
import {
  checkEmptyFieldsObj,
  fillEmptyFieldsObj,
} from "../../utils/emptyFieldChecker";

const initialState = {
  id: Date.now(),
  category: {
    name: "",
    description: "",
    floor_area: -1,
    type_of_beds: fillEmptyFieldsObj(bedsData, -1),
    pax: -1,
    weekday_price: "",
    weekend_price: "",
    quantity: -1,
  },
  amenities: {},
  rule: {
    content: "",
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLEAR_ROOM_DATA":
      return { ...initialState, id: Date.now() };
    case "SET_ROOM_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_ROOM_CATEGORY":
      return {
        ...state,
        category: {
          ...state.category,
          ...action.payload,
        },
      };
    case "SET_ROOM_AMENITIES":
      return {
        ...state,
        amenities: {
          ...state.amenities,
          ...action.payload,
        },
      };
    case "SET_ROOM_RULE":
      return {
        ...state,
        rule: {
          ...state.rule,
          content: action.payload,
        },
      };
    default:
      return state;
  }
};

const AddRooms = ({ isFocused = true }) => {
  const [currentRoom, dispatch] = useReducer(reducer, initialState, undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [index, setIndex] = useState(0);

  const currentSwipeRef = useRef(null);
  const pagerViewRef = useRef(null);

  const { listingState, setListingData } = useCreateListingContext();
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();

  const listingId = route.params?.listingId;

  const { data: rooms, isFetching } = useQuery({
    queryKey: ["listings", listingId, "rooms"],
    queryFn: () => fetchListingRooms({ listingId }),
    enabled: !!listingId,
  });

  const roomActions = useMemo(
    () => ({
      setCurrentRoom: (payload) => dispatch({ type: "SET_ROOM_DATA", payload }),
      setRoomCategory: (payload) =>
        dispatch({ type: "SET_ROOM_CATEGORY", payload }),
      setRoomAmenities: (payload) =>
        dispatch({ type: "SET_ROOM_AMENITIES", payload }),
      setRoomRule: (payload) => dispatch({ type: "SET_ROOM_RULE", payload }),
      clearCurrentRoom: () => dispatch({ type: "CLEAR_ROOM_DATA" }),
    }),
    [],
  );

  const mapRooms = useCallback((rooms) => {
    return rooms.map((room) => ({
      ...room,
      amenities: room.amenities.reduce((acc, amenity) => {
        acc[amenity.name] = true;
        return acc;
      }, {}),
    }));
  }, []);

  useEffect(() => {
    // Set rooms data if fetched
    if (rooms) {
      setListingData({ rooms: mapRooms(rooms) });
    }
  }, [rooms]);

  const onOpenModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setIsEditing(false);
    setIndex(0);
    roomActions.clearCurrentRoom();
  }, []);

  const onDeleteRoom = useCallback(
    (roomId) => {
      setListingData({
        rooms: listingState.rooms.filter((room) => room.id !== roomId),
      });

      roomActions.clearCurrentRoom();
      onCloseModal();
    },
    [listingState.rooms],
  );

  const onEditRoom = useCallback((room) => {
    setIsEditing(true);
    roomActions.setCurrentRoom(room);
    onOpenModal();
  }, []);

  const onAddRoom = useCallback(() => {
    let isExists = false;

    // Update room if it exists
    const updatedRooms = listingState.rooms.map((room) => {
      if (room.id === currentRoom.id) {
        isExists = true;
        return currentRoom;
      }
      return room;
    });

    // If no room was updated, add a new room
    if (!isExists) {
      updatedRooms.push(currentRoom);
    }

    setListingData({ rooms: updatedRooms });

    roomActions.clearCurrentRoom();
    onCloseModal();
  }, [currentRoom, listingState.rooms]);

  const onPageChange = useCallback((index) => {
    pagerViewRef.current.setPage(index);
    setIndex(index);
  }, []);

  const headerLabels = useMemo(
    () => ({
      1: "Type of Beds",
      2: "Amenities",
      3: "Addons",
      default: isEditing ? "Edit Room" : "Add New Room",
    }),
    [isEditing],
  );

  const headerOnClose = useMemo(() => {
    if (index > 0) {
      return () => onPageChange(0);
    }

    return onCloseModal;
  }, [index, onPageChange, onCloseModal]);

  const footerProps = useMemo(() => {
    if (index > 0) {
      // return {
      //   text: "Confirm",
      //   action: () => onPageChange(0),
      // };
      return null;
    }

    return {
      text: isEditing ? "Save Changes" : "Add Room",
      action: onAddRoom,
    };
  }, [index, isEditing, onPageChange, onAddRoom]);

  const isFooterButtonDisabled = useMemo(() => {
    return checkEmptyFieldsObj(currentRoom.category, ["description"]);
  }, [currentRoom.category]);

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => {
      if (!footerProps) {
        return null;
      }

      return (
        <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
          <AppFooter>
            <View style={globalStyles.buttonRow}>
              {isEditing && (
                <ButtonLarge
                  flexFull
                  color={Colors.red}
                  onPress={() => {
                    onDeleteRoom(currentRoom.id);
                  }}
                >
                  Delete
                </ButtonLarge>
              )}

              <ButtonLarge
                flexFull
                disabled={isFooterButtonDisabled}
                onPress={footerProps.action}
              >
                {footerProps.text}
              </ButtonLarge>
            </View>
          </AppFooter>
        </BottomSheetFooter>
      );
    },
    [
      currentRoom.id,
      footerProps,
      index,
      isEditing,
      isFooterButtonDisabled,
      onDeleteRoom,
    ],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <AddRoomItem
        item={item.category}
        onPress={() => onEditRoom(item)}
        onDelete={() => onDeleteRoom(item.id)}
      />
    ),
    [onDeleteRoom, onEditRoom],
  );

  const headerRight = useCallback(() => {
    return (
      <Item
        title="Add Rooms"
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
            data={listingState.rooms}
            renderItem={renderItem}
            contentContainerStyle={style.contentContainer}
            ListEmptyComponent={
              <View style={globalStyles.flexCenter}>
                <Text style={globalStyles.emptyTextCenter}>
                  No rooms added yet.
                </Text>
              </View>
            }
          />
        </SwipeableProvider>
      </View>

      <AddRoomProvider value={roomActions}>
        <AddRoomSheet
          ref={pagerViewRef}
          index={index}
          isVisible={isModalVisible}
          currentRoom={currentRoom}
          onPageChange={onPageChange}
          onClose={headerOnClose}
          headerLabel={headerLabels[index] || headerLabels.default}
          footerComponent={renderFooter}
        />
      </AddRoomProvider>

      <DialogLoading visible={isFetching} />
    </>
  );
};

export default AddRooms;
