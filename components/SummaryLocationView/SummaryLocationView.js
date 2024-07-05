import React, { memo } from "react";
import { Text, View } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";
import { openLocationAuto } from "../../utils/locationOpener";
import ButtonLink from "../ButtonLink/ButtonLink";

const SummaryLocationView = ({ location }) => {
  return (
    <View style={style.container}>
      <Text style={style.headerText}>Location</Text>

      <View style={globalStyles.containerGap}>
        <Text>{location}</Text>
        <ButtonLink
          textStyle={style.link}
          onPress={() => openLocationAuto(location)}
        >
          Get Directions
        </ButtonLink>
      </View>
    </View>
  );
};

export default memo(SummaryLocationView);
