import { format } from "date-fns";
import React from "react";
import { ScrollView, Text } from "react-native";
import { Modal } from "react-native-paper";

import style from "./ModalSectionStyles";

const ModalSection = ({ visible, onDismiss, duration, progress }) => {
  return (
    <Modal
      visible={visible}
      transparent
      onDismiss={onDismiss}
      contentContainerStyle={style.mainContainer}
    >
      <Text style={style.headerText}>Sections</Text>
      <ScrollView horizontal contentContainerStyle={style.scrollViewContainer}>
        <Text>
          {progress ? format(progress, "m:ss") : null}/
          {duration ? format(duration, "mm:ss") : null}
        </Text>
      </ScrollView>
    </Modal>
  );
};

export default ModalSection;
