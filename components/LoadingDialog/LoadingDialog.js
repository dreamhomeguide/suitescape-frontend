import React, { memo } from "react";
import { ActivityIndicator } from "react-native";

import ButtonLink from "../ButtonLink/ButtonLink";
import PaperDialog from "../PaperDialog/PaperDialog";

const LoadingDialog = ({ visible, onCancel, title = "Loading..." }) => {
  return (
    <PaperDialog title={title} visible={visible}>
      <ActivityIndicator />
      {onCancel && <ButtonLink onPress={onCancel}>Cancel</ButtonLink>}
    </PaperDialog>
  );
};

export default memo(LoadingDialog);
