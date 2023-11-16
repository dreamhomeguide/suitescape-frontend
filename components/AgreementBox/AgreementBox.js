import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

import style from "./AgreementBoxStyles";
import { Colors } from "../../assets/Colors";
import ButtonLink from "../ButtonLink/ButtonLink";

const AgreementBox = ({ checked, setChecked }) => {
  const { colors } = useTheme();

  return (
    <View style={style.container}>
      <Checkbox.Android
        status={checked ? "checked" : "unchecked"}
        onPress={() => setChecked(!checked)}
        color={Colors.blue}
      />
      <Text
        style={{
          color: colors.text,
          ...style.textContainer,
        }}
      >
        I have agreed to the{" "}
        <ButtonLink
          type="text"
          onPress={() => console.log("Terms and Conditions")}
          textStyle={style.text}
        >
          Terms and Conditions
        </ButtonLink>{" "}
        and{" "}
        <ButtonLink
          type="text"
          onPress={() => console.log("Privacy Policy")}
          textStyle={style.text}
        >
          Privacy Policy
        </ButtonLink>{" "}
        of Suitescape.
      </Text>
    </View>
  );
};

export default AgreementBox;
