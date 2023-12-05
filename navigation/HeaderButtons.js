import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";

export const IoniconsHeaderButton = (props) => (
  <HeaderButton
    IconComponent={Ionicons}
    iconSize={25}
    color="black"
    {...props}
  />
);
