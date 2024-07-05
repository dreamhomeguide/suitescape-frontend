import React, { memo } from "react";
import { View } from "react-native";
import { Badge } from "react-native-ui-lib";

import style from "./IconBadgeStyles";
import { Colors } from "../../assets/Colors";

const IconBadge = ({
  count,
  badgeSize = 15,
  labelColor = Colors.blue,
  backgroundColor = Colors.lightgray,
  isAbsolute = true,
  containerStyle,
  children,
}) => {
  return (
    <View>
      {count > 0 && (
        <Badge
          label={count}
          size={badgeSize}
          labelFormatterLimit={1}
          backgroundColor={backgroundColor}
          labelStyle={{ color: labelColor }}
          containerStyle={{
            ...(isAbsolute && style.badge),
            ...containerStyle,
          }}
        />
      )}
      {children}
    </View>
  );
};

export default memo(IconBadge);
