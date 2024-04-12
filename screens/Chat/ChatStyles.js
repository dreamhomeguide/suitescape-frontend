import { StyleSheet } from "react-native";

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
  sendMessageContainer: {
    paddingHorizontal: 20,
    maxHeight: "30%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  messageEditorContainer: {
    marginVertical: 15,
    borderRadius: 15,
    backgroundColor: Colors.backgroundGray,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  textInput: {
    fontSize: 15,
    marginVertical: 10,
    marginLeft: 0,
    width: "83%",
  },
  emojiKeyboardContainer: {
    marginVertical: 10,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  sendMessageButtonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    marginVertical: 25,
    marginLeft: 5,
  },
});
export default style;
