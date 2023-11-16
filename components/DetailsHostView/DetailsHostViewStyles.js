import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 12,
  },
  hostContentContainer: {
    padding: 15,
    flexDirection: "row",
  },
  hostDetailsContainer: {
    flex: 1,
    paddingTop: 2,
    paddingLeft: 12,
  },
  hostNameText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  responseContainer: {
    marginTop: 8,
    marginBottom: 1,
  },
  responseText: {
    color: "black",
    fontSize: 12,
    marginBottom: 3,
  },
});

export default style;
