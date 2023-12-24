import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import style from "./MessagesStyle";
import globalStyles from "../../assets/styles/globalStyles";
import FormInput from "../../components/FormInput/FormInput";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import { Routes } from "../../navigation/Routes";
import { getHeaderToken } from "../../services/SuitescapeAPI";

const DATA = [
  {
    id: 1,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 2,
    name: "Reca Farm",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 3,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 4,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 5,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 6,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 7,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 8,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 9,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 10,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
  {
    id: 11,
    name: "Dream Home",
    message:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
  },
];

const Messages = () => {
  const navigation = useNavigation();

  const token = getHeaderToken();

  if (!token) {
    return (
      <View style={globalStyles.flexCenter}>
        <Text>Not logged in</Text>
      </View>
    );
  }

  return (
    <View style={style.messagesContainer}>
      <RectButton
        onPress={() => navigation.navigate(Routes.SEARCH_MESSAGES)}
        style={style.searchContainer}
      >
        <View pointerEvents="none">
          <FormInput placeholder="Search" />
        </View>
      </RectButton>

      <FlatList
        data={DATA}
        contentInset={{ bottom: 35 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        // ListHeaderComponent={
        // <View style={style.searchContainer}>
        //   <View
        //     style={{ flexDirection: "row", justifyContent: "space-between" }}
        //   >
        //     <Text
        //       onPress={() => navigation.navigate(Routes.SEARCH_MESSAGES)}
        //       style={style.searchText}
        //     >
        //       Search
        //     </Text>
        //     <FontAwesome name="search" size={20} color="black" />
        //   </View>
        // </View>
        // }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => style.singleChatContainer(pressed)}
            onPress={() => navigation.navigate(Routes.CHAT)}
          >
            <ProfileImage borderWidth={0} />
            <View style={style.singleChatDetails}>
              <Text style={style.hostName}>{item.name}</Text>
              <Text numberOfLines={1} style={style.unreadMessage}>
                {item.message}
              </Text>
            </View>
            <View style={style.messageStatusContainer}>
              <Text style={style.timeFrame}>1:00 PM</Text>
              <View style={style.unreadMessagesCount}>
                <Text style={style.newMessageCountText}>1</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Messages;
