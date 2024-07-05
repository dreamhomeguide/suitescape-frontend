import React, { memo } from "react";
import { Dialog, Portal } from "react-native-paper";

import style from "./DialogPaperStyles";

const DialogPaper = ({ title, visible, children, ...props }) => (
  <Portal>
    <Dialog
      visible={visible}
      dismissable={false}
      dismissableBackButton={false}
      style={style.container}
      {...props}
    >
      <Dialog.Title style={style.title}>{title}</Dialog.Title>
      <Dialog.Content style={style.contentContainer}>{children}</Dialog.Content>
    </Dialog>
  </Portal>
);

export default memo(DialogPaper);
