import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

import { Colors } from "../assets/Colors";
import HeaderTitle from "../components/HeaderTitle/HeaderTitle";

const useTransparentHeader = (height) => {
  const yOffset = useRef(new Animated.Value(0)).current;

  const headerOpacity = yOffset.interpolate({
    inputRange: [0, height],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const navigation = useNavigation();

  // Change back button color when gallery is not visible
  useEffect(() => {
    navigation.setOptions({
      headerTitle: ({ children }) => (
        <HeaderTitle containerStyle={{ opacity: headerOpacity }}>
          {children}
        </HeaderTitle>
      ),
      headerBackground: () => (
        <Animated.View
          style={{
            backgroundColor: Colors.blue,
            opacity: headerOpacity,
            ...StyleSheet.absoluteFillObject,
          }}
        />
      ),
    });
  }, [headerOpacity, navigation]);

  return { yOffset };
};

export default useTransparentHeader;
