import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const MessagesStyle = StyleSheet.create({
  headerText: {
    fontSize: 25,
    fontWeight: "500",
  },
  messagesDivider: {
    height: 2,
    backgroundColor: "#F4F4F4",
  },
  searchContainer: {
    backgroundColor: "#3333330D",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 20,
  },
  searchText: {
    fontSize: 15,
    width: "93%",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
  },
  singleChatContainer: (pressed) => ({
    opacity: pressed ? 0.5 : 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingVertical: 10,
  }),
  singleChatDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  hostName: {
    fontSize: 20,
    fontWeight: "500",
  },
  unreadMessage: {
    color: "#514E4E",
    marginTop: 2,
    fontSize: 15,
  },
  messageStatusContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timeFrame: {
    marginVertical: 5,
    color: "#514E4E",
  },
  unreadMessagesCount: {
    height: 20,
    width: 20,
    borderRadius: 20 * 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blue,
  },
  newMessageCountText: {
    color: "white",
  },
});

export default MessagesStyle;
