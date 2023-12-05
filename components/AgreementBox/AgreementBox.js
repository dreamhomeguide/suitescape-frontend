import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import { Checkbox } from "react-native-ui-lib";

import style from "./AgreementBoxStyles";
import { Colors } from "../../assets/Colors";
import ButtonLink from "../ButtonLink/ButtonLink";

const AgreementBox = ({ checked, setChecked }) => {
  const { colors } = useTheme();

  return (
    <View style={style.container}>
      <Checkbox
        value={checked}
        onValueChange={() => setChecked(!checked)}
        size={23}
        color={Colors.blue}
        style={style.checkbox}
      />
      <Text style={style.textContainer({ textColor: colors.text })}>
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
