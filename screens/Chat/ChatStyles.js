import { Platform, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";
const style = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerNameAndActiveStatus: {
    marginHorizontal: 10,
  },
  materialIconError: {
    color: Colors.red,
  },
  recipientName: {
    fontSize: 20,
  },
  activeStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeStatusIndicator: (isActive) => ({
    height: 10,
    width: 10,
    borderRadius: 15 * 0.5,
    marginHorizontal: 5,
    backgroundColor: isActive ? "#8DCE59" : "gray",
  }),
  messageHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 50,
  },
  messageList: {
    backgroundColor: Colors.backgroundGray,
  },
  messageListContent: {
    paddingVertical: 15,
  },
  messageHostName: {
    fontSize: 20,
    fontWeight: "500",
    paddingTop: 10,
    textAlign: "center",
  },
  ratingContainer: {
    paddingVertical: 5,
  },
  sendMessageContainer: {
    maxHeight: "30%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    marginVertical: 15,
    borderRadius: 20,
  },
  inputField: {
    padding: 15,
    paddingBottom: Platform.OS === "android" ? 10 : 15,
  },
  inputText: {
    fontSize: 16,
  },
  sendButton: {
    padding: 15,
    paddingRight: 5,
  },
});
export default style;
