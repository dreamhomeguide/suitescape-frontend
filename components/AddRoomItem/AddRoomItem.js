import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { memo, useCallback, useRef } from "react";
import { Text, View } from "react-native";
import { BorderlessButton, Swipeable } from "react-native-gesture-handler";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { useOnSwipeableWillOpen } from "../../contexts/SwipeableContext";

const AddRoomItem = ({ item, onPress, onDelete }) => {
  const swipeRef = useRef(null);

  const onSwipeableWillOpen = useOnSwipeableWillOpen(swipeRef);

  const renderRightActions = useCallback(() => {
    return (
      <BorderlessButton
        activeOpacity={0.8}
        onPress={() => {
          onDelete && onDelete();
          swipeRef.current?.reset();
        }}
      >
        <View
          style={{
            ...globalStyles.swiperActionButton,
            backgroundColor: Colors.red,
          }}
        >
          <Text style={globalStyles.swiperActionText}>Delete Room</Text>
        </View>
      </BorderlessButton>
    );
  }, [onDelete]);

  return (
    <Swipeable
      ref={swipeRef}
      onSwipeableWillOpen={onSwipeableWillOpen}
      renderRightActions={renderRightActions}
      overshootRight={false}
      containerStyle={globalStyles.swiperContainer}
    >
      <View style={style.listItemContainer}>
        <View style={style.listItemContentContainer}>
          <Text style={style.listItemTitle}>{item.name}</Text>
          {item.description && (
            <Text numberOfLines={4}>
              <Text style={style.listItemLabel}>Description: </Text>
              {item.description}
            </Text>
          )}
          <Text>
            <Text style={style.listItemLabel}>Floor Area: </Text>
            {item.floor_area} sqm
          </Text>
          <Text>
            <Text style={style.listItemLabel}>Price: </Text>₱{item.price}
          </Text>
          <Text>
            <Text style={style.listItemLabel}>Quantity: </Text>
            {item.quantity}
          </Text>
        </View>

        <BorderlessButton onPress={onPress}>
          <MaterialCommunityIcons name="pencil" size={24} color={Colors.blue} />
        </BorderlessButton>
      </View>
    </Swipeable>
  );
};

export default memo(AddRoomItem);
