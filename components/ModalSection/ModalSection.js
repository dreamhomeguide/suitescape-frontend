import { format } from "date-fns";
import React from "react";
import { ScrollView, Text } from "react-native";
import { useTheme, Modal } from "react-native-paper";

import style from "./ModalSectionStyles";

const ModalSection = ({ visible, onDismiss, duration, progress }) => {
  const theme = useTheme();

  const modalTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      backdrop: "rgba(0,0,0,0.2)",
    },
  };

  return (
    <Modal
      visible={visible}
      transparent
      onDismiss={onDismiss}
      contentContainerStyle={style.mainContainer}
      theme={modalTheme}
    >
      <Text style={style.headerText}>Sections</Text>
      <ScrollView horizontal contentContainerStyle={style.scrollViewContainer}>
        <Text>
          {progress ? format(progress, "m:ss") : "-:--"}/
          {duration ? format(duration, "mm:ss") : "--:--"}
        </Text>
      </ScrollView>
    </Modal>
  );
};

export default ModalSection;
