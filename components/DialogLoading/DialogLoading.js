import React, { memo } from "react";
import { ActivityIndicator } from "react-native";

import ButtonLink from "../ButtonLink/ButtonLink";
import DialogPaper from "../DialogPaper/DialogPaper";

const DialogLoading = ({ title = "Loading...", visible, onCancel }) => {
  return (
    <DialogPaper title={title} visible={visible}>
      <ActivityIndicator />
      {onCancel && <ButtonLink onPress={onCancel}>Cancel</ButtonLink>}
    </DialogPaper>
  );
};

export default memo(DialogLoading);
