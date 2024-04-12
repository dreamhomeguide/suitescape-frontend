import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  hostContentContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  hostDetailsContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  hostNameText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  responseContainer: {
    marginTop: 5,
    marginBottom: 1,
  },
  responseText: {
    color: "black",
    fontSize: 12,
    marginBottom: 3,
  },
});

export default style;
