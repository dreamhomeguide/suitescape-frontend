import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { format } from "date-fns";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./AddVideoSheetItemStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import FormInputSheet from "../FormInputSheet/FormInputSheet";

const AddVideoSheetItem = ({ item, onLabelChange, onDelete }) => {
  return (
    <View>
      <Text>{format(item.milliseconds, "mm:ss")}</Text>

      <View style={globalStyles.buttonRowSmall}>
        <FormInputSheet
          label="Section Label"
          placeholder="Enter label"
          value={item.label}
          onChangeText={onLabelChange}
          autoCorrect={false}
          autoCapitalize="words"
          containerStyle={globalStyles.flexFull}
        />

        <ButtonIcon
          renderIcon={() => (
            <View style={globalStyles.flexCenter}>
              <MaterialCommunityIcons
                name="delete"
                size={24}
                color={Colors.red}
              />
            </View>
          )}
          onPress={onDelete}
          color={Colors.lightgray}
          pressedColor={Colors.gray}
          containerStyle={style.button}
        />
      </View>
    </View>
  );
};

export default memo(AddVideoSheetItem);
