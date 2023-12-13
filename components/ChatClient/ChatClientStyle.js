import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const ChatClientStyle = StyleSheet.create({
  mainContainer: (type) => ({
    flex: 1,
    paddingHorizontal: 15,
    alignItems: type === "user" ? "flex-end" : "flex-start",
    justifyContent: type === "user" ? "flex-end" : "flex-start",
  }),
  chatContainer: (type) => ({
    maxWidth: "80%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: type === "user" ? 20 : 5,
    borderTopRightRadius: type === "user" ? 5 : 20,
    borderBottomLeftRadius: type === "user" ? 20 : 15,
    borderBottomRightRadius: type === "user" ? 15 : 20,
    backgroundColor: type === "user" ? "white" : Colors.blue,
    marginVertical: 20,
  }),

  message: (type) => ({
    fontSize: 15,
    color: type === "user" ? "black" : "white",
  }),
});

export default ChatClientStyle;
