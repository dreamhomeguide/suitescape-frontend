import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./AppFooterDetailsStyles";
import ButtonLarge from "../ButtonLarge/ButtonLarge";
import ButtonLink from "../ButtonLink/ButtonLink";

const AppFooterDetails = ({
  title,
  titleStyle,
  buttonVisible = true,
  buttonLabel,
  buttonOnPress,
  buttonProps,
  buttonLinkVisible = true,
  buttonLinkLabel,
  buttonLinkOnPress,
  children,
}) => (
  <View style={style.footer}>
    <View style={style.footerContentContainer}>
      <View style={style.footerContent}>
        {title && <Text style={{ ...style.text, ...titleStyle }}>{title}</Text>}
        {buttonLinkVisible && buttonLinkLabel && buttonLinkOnPress && (
          <ButtonLink textStyle={style.footerLink} onPress={buttonLinkOnPress}>
            {buttonLinkLabel}
          </ButtonLink>
        )}
        {children}
      </View>
    </View>

    {buttonVisible && (
      <ButtonLarge flexFull onPress={buttonOnPress} {...buttonProps}>
        {buttonLabel}
      </ButtonLarge>
    )}
  </View>
);

export default memo(AppFooterDetails);
