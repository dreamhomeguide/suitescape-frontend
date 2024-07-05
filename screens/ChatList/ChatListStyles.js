import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  headerText: {
    fontSize: 25,
    fontWeight: "500",
  },
  messagesDivider: {
    height: 2,
    backgroundColor: "#F4F4F4",
  },
  headerContainer: {
    backgroundColor: "white",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOffset: { height: 8, width: 0 },
    elevation: 5,
    marginBottom: 8,
  },
  searchContainer: {
    borderRadius: 10,
    marginVertical: 15,
    marginHorizontal: 15,
  },
  searchText: {
    fontSize: 15,
    width: "93%",
  },
  singleChatContainer: (pressed) => ({
    opacity: pressed ? 0.5 : 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingVertical: 10,
    paddingHorizontal: 15,
    columnGap: 10,
  }),
  singleChatDetails: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 3,
  },
  hostName: {
    fontSize: 18,
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

export default style;
