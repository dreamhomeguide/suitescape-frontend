import { StatusBar, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    paddingVertical: 10,
    rowGap: 25,
  },
  headerDivider: ({ color }) => ({
    height: 2,
    backgroundColor: color,
    marginVertical: 20,
  }),
  footer: {
    height: 20,
  },
  bottomButtonContainer: {
    marginHorizontal: 15,
    marginBottom: StatusBar.currentHeight + 10,
  },
  logoutButton: {
    color: Colors.red,
    fontWeight: "600",
  },
  loginButton: {
    color: Colors.blue,
    fontWeight: "600",
  },
});

export default style;
