import React from "react";
import { View } from "react-native";

import style from "./LogoViewStyles";
import Logo from "../../assets/images/svgs/logo-only.svg";

const LogoView = () => (
  <View style={style.container}>
    <Logo width={70} height={70} />
  </View>
);

export default LogoView;
