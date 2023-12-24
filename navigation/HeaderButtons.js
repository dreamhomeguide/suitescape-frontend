import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";

import Fontello from "../assets/fontello/Fontello";

export const FontelloHeaderButton = (props) => (
  <HeaderButton
    IconComponent={Fontello}
    iconSize={15}
    color="black"
    {...props}
  />
);
