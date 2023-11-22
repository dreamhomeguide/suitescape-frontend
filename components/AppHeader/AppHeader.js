import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./AppHeaderStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import ButtonBack from "../ButtonBack/ButtonBack";

const ICON_SIZE = 25;

const AppHeader = ({
  title,
  children,
  textStyle,
  menuOnPress,
  menuEnabled = false,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View
      style={{
        paddingTop: insets.top + 5,
        ...style.headerContainer({
          bgColor: colors.background,
          borderColor: colors.border,
        }),
        ...style.rowContainer,
      }}
    >
      <View style={style.rowContainer}>
        <ButtonBack onPress={() => navigation.goBack()} color={colors.text} />
        <Text
          style={{ ...style.text({ textColor: colors.text }), ...textStyle }}
        >
          {title}
        </Text>
      </View>
      <View style={{ ...style.rowContainer, ...style.actionsContainer }}>
        {/* Use like this:
         ({size, color}) => (<Icon size={size} color={color} />)
         */}
        {typeof children === "function"
          ? children({ size: ICON_SIZE, color: colors.text })
          : children}

        {menuEnabled && (
          <Pressable
            onPress={menuOnPress}
            style={({ pressed }) => pressedOpacity(pressed, 0.3)}
          >
            <Ionicons name="menu" color={colors.text} size={ICON_SIZE} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default memo(AppHeader);
