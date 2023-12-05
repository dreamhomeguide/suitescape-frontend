import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles, {
  pressedBgColor,
  pressedOpacity,
} from "../../assets/styles/globalStyles";
import FormInput from "../../components/FormInput/FormInput";
import ProfileImage from "../../components/ProfileImage/ProfileImage";

const ManageAccount = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={globalStyles.flexFull}
    >
      <ScrollView contentInset={{ top: 10, bottom: 15 }}>
        <View style={{ alignItems: "center", paddingVertical: 15 }}>
          <View>
            <Pressable>
              {({ pressed }) => (
                <ProfileImage
                  size={120}
                  containerStyle={{ ...pressedOpacity(pressed) }}
                />
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => ({
                position: "absolute",
                backgroundColor: Colors.black,
                height: 30,
                width: 30,
                borderRadius: 50,
                bottom: 0,
                right: 10,
                borderWidth: 1,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
                ...pressedBgColor(pressed, Colors.gray),
              })}
            >
              <Ionicons
                name="add"
                size={25}
                color="white"
                style={{
                  alignSelf: "center",
                  left: 1,
                }}
              />
            </Pressable>
          </View>
        </View>

        <View style={{ paddingHorizontal: 15 }}>
          <FormInput
            type="editable"
            placeholder="First Name"
            onEditDone={() => console.log("Done")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ManageAccount;
