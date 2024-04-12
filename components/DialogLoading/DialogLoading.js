import React, { memo } from "react";
import { ActivityIndicator } from "react-native";

import ButtonLink from "../ButtonLink/ButtonLink";
import DialogPaper from "../DialogPaper/DialogPaper";

const DialogLoading = ({
  title = "Loading...",
  visible,
  onCancel,
  ...props
}) => {
  return (
    <DialogPaper title={title} visible={visible} {...props}>
      <ActivityIndicator />
      {onCancel && <ButtonLink onPress={onCancel}>Cancel</ButtonLink>}
    </DialogPaper>
  );
};

export default memo(DialogLoading);
