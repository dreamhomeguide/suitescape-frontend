import React, { memo } from "react";
import { Badge } from "react-native-ui-lib";

import style from "./IconBadgeStyles";

const IconBadge = ({ count, children }) => {
  return (
    <>
      {count > 0 && (
        <Badge
          label={count}
          size={15}
          labelFormatterLimit={1}
          backgroundColor="black"
          labelStyle={style.label}
          containerStyle={style.badge}
        />
      )}
      {children}
    </>
  );
};

export default memo(IconBadge);
