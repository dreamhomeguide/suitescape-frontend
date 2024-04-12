import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./AppFooterDetailsStyles";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";

const AppFooterDetails = ({
  title,
  titleStyle,
  buttonLabel,
  buttonLinkLabel,
  buttonOnPress,
  buttonLinkOnPress,
  buttonVisible = true,
  buttonLinkVisible = true,
  children,
}) => (
  <View style={style.footer}>
    <View style={style.footerContentContainer}>
      <View style={style.footerContent}>
        <Text style={{ ...style.text, ...titleStyle }}>{title}</Text>
        {buttonLinkVisible && (
          <ButtonLink textStyle={style.footerLink} onPress={buttonLinkOnPress}>
            {buttonLinkLabel}
          </ButtonLink>
        )}
        {children}
      </View>
    </View>
    {buttonVisible && (
      <Button containerStyle={style.footerButton} onPress={buttonOnPress}>
        {buttonLabel}
      </Button>
    )}
  </View>
);

export default memo(AppFooterDetails);
