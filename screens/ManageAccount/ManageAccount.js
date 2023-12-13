import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import React, { useEffect, useReducer } from "react";
import {
  Alert,
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
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import useFetchAPI from "../../hooks/useFetchAPI";
import { getHeaderToken } from "../../services/SuitescapeAPI";
import convertMMDDYYYY from "../../utilities/dateConverter";
import capitalizedText from "../../utilities/textCapitalizer";

const initialState = {
  firstName: "",
  lastName: "",
  birthday: "",
  email: "",
  nationality: "",
  gender: "",
  governmentId: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const mappings = {
  firstName: "firstname",
  lastName: "lastname",
  birthday: "date_of_birth",
  email: "email",
  nationality: "nationality",
  gender: "gender",
  governmentId: "government_id",
};

const ManageAccount = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const { data: userData, isLoading } = useFetchAPI("/profile");

  const setAccountData = (payload) => {
    dispatch({ type: "SET_DATA", payload });
  };

  useEffect(() => {
    if (!getHeaderToken()) {
      navigation.goBack();
      Alert.alert("You are not logged in.");
    }
  }, []);

  useEffect(() => {
    if (userData) {
      Object.entries(mappings).forEach(([state, userDataKey]) => {
        if (userData[userDataKey]) {
          if (state === "birthday") {
            userData[userDataKey] = format(
              new Date(convertMMDDYYYY(userData[userDataKey])),
              "MM/dd/yyyy",
            );
          }

          // Temporary until picker is used
          if (state === "gender") {
            userData[userDataKey] = capitalizedText(userData[userDataKey]);
          }

          setAccountData({ [state]: userData[userDataKey] });
        }
      });
    }
  }, [userData]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={80}
        style={globalStyles.flexFull}
      >
        <ScrollView contentInset={{ top: 10, bottom: 35 }}>
          <View
            style={{ alignItems: "center", paddingTop: 15, paddingBottom: 25 }}
          >
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

          <View style={{ paddingHorizontal: 15, rowGap: 5 }}>
            <FormInput
              type="editable"
              value={state.firstName}
              onChangeText={(value) => {
                setAccountData({ firstName: value });
              }}
              placeholder="First Name"
              onEditDone={() => console.log("Done")}
            />
            <FormInput
              type="editable"
              value={state.lastName}
              onChangeText={(value) => {
                setAccountData({ lastName: value });
              }}
              placeholder="Last Name"
              onEditDone={() => console.log("Done")}
            />
            <FormInput
              type="date"
              value={state.birthday}
              onChangeText={(value) => {
                setAccountData({ birthday: value });
              }}
              placeholder="Birthday"
            />
            <FormInput
              type="editable"
              value={state.email}
              onChangeText={(value) => {
                setAccountData({ email: value });
              }}
              placeholder="Email"
              onEditDone={() => console.log("Done")}
            />
            <FormInput
              type="editable"
              value={state.nationality}
              onChangeText={(value) => {
                setAccountData({ nationality: value });
              }}
              placeholder="Nationality"
              onEditDone={() => console.log("Done")}
            />
            <FormInput
              type="editable"
              value={state.gender}
              onChangeText={(value) => {
                setAccountData({ gender: value });
              }}
              placeholder="Gender"
              onEditDone={() => console.log("Done")}
            />
            <FormInput
              type="editable"
              value={state.governmentId}
              onChangeText={(value) => {
                setAccountData({ governmentId: value });
              }}
              placeholder="Government ID"
              onEditDone={() => console.log("Done")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppFooter>
        <ButtonLarge>Save Changes</ButtonLarge>
      </AppFooter>
      <DialogLoading visible={isLoading} />
    </>
  );
};

export default ManageAccount;
