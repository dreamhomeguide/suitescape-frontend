import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ChatStyle";
import { Colors } from "../../assets/Colors";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import ButtonBack from "../../components/ButtonBack/ButtonBack";
import ChatItem from "../../components/ChatItem/ChatItem";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import StarRatingView from "../../components/StarRatingView/StarRatingView";

const message = [
  {
    id: 1,
    type: "user",
    message: "Hi, I would like to ask if the room is still available?",
  },
  {
    id: 2,
    type: "host",
    message: "Yes, it is still available. When would you like to move in?",
  },
  {
    id: 3,
    type: "user",
    message: "I would like to move in by the end of this month.",
  },
  {
    id: 4,
    type: "host",
    message: "Alright, I will send you the contract.",
  },
  {
    id: 5,
    type: "user",
    message: "Thank you.",
  },
  {
    id: 6,
    type: "host",
    message: "You're welcome.",
  },
  {
    id: 7,
    type: "user",
    message: "Hi, I would like to ask if the room is still available?",
  },
  {
    id: 8,
    type: "host",
    message: "Yes, it is still available. When would you like to move in?",
  },
  {
    id: 9,
    type: "user",
    message: "I would like to move in by the end of this month.",
  },
  {
    id: 10,
    type: "host",
    message: "Alright, I will send you the contract.",
  },
  {
    id: 11,
    type: "user",
    message: "Thank you.",
  },
  {
    id: 12,
    type: "host",
    message: "You're welcome.",
  },
];

const Chat = () => {
  const flatListRef = useRef(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    flatListRef.current.scrollToEnd({ animated: false });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        marginTop: insets.top,
        marginBottom: insets.bottom,
        ...globalStyles.flexFull,
      }}
    >
      <View style={style.headerContainer}>
        <View style={style.headerTitleContainer}>
          <ButtonBack />
          <View style={style.headerNameAndActiveStatus}>
            <Text style={style.recipientName}>Dream Home</Text>
            <View style={style.activeStatusContainer}>
              <Text>Active Now</Text>
              <View style={style.activeStatusIndicator} />
            </View>
          </View>
        </View>
        <MaterialIcons style={style.materialIconError} name="error" size={25} />
      </View>

      <FlatList
        ref={flatListRef}
        onLayout={() => {
          if (Platform.OS === "ios") {
            if (!Keyboard.isVisible()) {
              flatListRef.current.scrollToEnd();
            }
          } else {
            if (Keyboard.isVisible()) {
              flatListRef.current.scrollToEnd();
            }
          }
        }}
        style={{ backgroundColor: Colors.backgroundGray }}
        data={message}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem {...item} />}
        getItemLayout={(data, index) => {
          return {
            length: 120,
            offset: 120 * index,
            index,
          };
        }}
        ListHeaderComponent={
          <View style={style.messageHeader}>
            <ProfileImage size={100} borderWidth={0} />
            <Text style={style.messageHostName}>Dream Home</Text>
            <StarRatingView
              starSize={15}
              rating={4.7}
              textStyle={{ color: "black" }}
              containerStyle={{ paddingVertical: 5 }}
            />
          </View>
        }
      />

      <View style={style.sendMessageContainer}>
        <View style={style.messageEditorContainer}>
          <TextInput
            style={style.textInput}
            // autoFocus
            multiline
            placeholder="Type a message..."
          />
          <View style={style.emojiKeyboardContainer}>
            <Entypo name="emoji-happy" size={24} color="black" />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => ({
            ...style.sendMessageButtonContainer,
            ...pressedOpacity(pressed),
          })}
        >
          <Ionicons name="ios-send" size={24} color="black" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
