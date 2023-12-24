import React from "react";
import { Text, View } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import { getHeaderToken } from "../../services/SuitescapeAPI";

const Cart = () => {
  const token = getHeaderToken();

  if (!token) {
    return (
      <View style={globalStyles.flexCenter}>
        <Text>Not logged in</Text>
      </View>
    );
  }

  return null;
};

export default Cart;
