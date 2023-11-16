import React, { memo } from "react";
import { Badge } from "react-native-paper";

import style from "./IconBadgeStyles";

const IconBadge = ({ count, children }) => {
  const theme = {
    colors: {
      error: "black",
      onError: "white",
    },
  };

  return (
    <>
      {count > 0 && (
        <Badge size={15} theme={theme} style={style.badge}>
          {count}
        </Badge>
      )}
      {children}
    </>
  );
};

export default memo(IconBadge);
