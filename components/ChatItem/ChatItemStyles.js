import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const ChatItemStyles = StyleSheet.create({
  mainContainer: (isSender) => ({
    flex: 1,
    paddingHorizontal: 15,
    alignItems: isSender ? "flex-end" : "flex-start",
    justifyContent: isSender === "user" ? "flex-end" : "flex-start",
  }),
  chatContainer: (isSender) => ({
    maxWidth: "80%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: isSender ? 20 : 5,
    borderTopRightRadius: isSender ? 5 : 20,
    borderBottomLeftRadius: isSender ? 20 : 15,
    borderBottomRightRadius: isSender ? 15 : 20,
    backgroundColor: isSender ? Colors.blue : "white",
    marginVertical: 4,
  }),

  message: (isSender) => ({
    fontSize: 15,
    color: isSender ? "white" : "black",
  }),
});

export default ChatItemStyles;
