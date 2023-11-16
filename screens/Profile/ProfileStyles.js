import { StatusBar, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    paddingVertical: 10,
    rowGap: 25,
  },
  headerDivider: {
    height: 2,
    backgroundColor: Colors.lightgray,
    marginTop: 15,
    marginBottom: 5,
  },
  settingsKeyContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  settingsKey: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  settingsValuePressed: {
    // paddingRight: 10,
    // paddingLeft: 5,
    borderRadius: 5,
  },
  settingsValueContainer: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    // marginLeft: 5,
    paddingLeft: 8,
    paddingRight: 5,
    paddingTop: 20,
    paddingBottom: 15,
    // borderBottomLeftRadius: 5,
    borderBottomRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgray,
  },
  logoutButtonContainer: {
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 3 + StatusBar.currentHeight,
  },
  logoutButton: {
    color: Colors.red,
    fontWeight: "600",
  },
});

export default style;
