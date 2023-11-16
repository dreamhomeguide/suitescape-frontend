import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./AppHeaderStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import ButtonBack from "../ButtonBack/ButtonBack";

const ICON_SIZE = 25;
const ICON_COLOR = "black";

const AppHeader = ({
  title,
  children,
  textStyle,
  menuOnPress,
  menuEnabled = false,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={{
        ...style.headerContainer,
        ...style.rowContainer,
        paddingTop: insets.top + 5,
      }}
    >
      <View style={style.rowContainer}>
        <ButtonBack onPress={() => navigation.goBack()} color={ICON_COLOR} />
        <Text style={{ ...style.text, ...textStyle }}>{title}</Text>
      </View>
      <View style={{ ...style.rowContainer, ...style.actionsContainer }}>
        {/* Use like this:
         ({size, color}) => (<Icon size={size} color={color} />)
         */}
        {typeof children === "function"
          ? children({ size: ICON_SIZE, color: ICON_COLOR })
          : children}

        {menuEnabled && (
          <Pressable
            onPress={menuOnPress}
            style={({ pressed }) => pressedOpacity(pressed, 0.3)}
          >
            <Ionicons name="menu" color={ICON_COLOR} size={ICON_SIZE} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default memo(AppHeader);
