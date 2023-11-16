import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  sliderContainer: {
    flex: 5,
    marginHorizontal: 20,
    height: 20,
  },
  labelText: {
    flex: 4,
    fontSize: 15,
    color: "black",
  },
  ratingText: {
    flex: 1,
    fontSize: 15,
    color: "black",
  },
  track: {
    height: 5,
  },
  maxTrack: {
    backgroundColor: Colors.lightgray,
  },
  minTrack: (rating) => ({
    backgroundColor: rating > 2.9 ? Colors.yellow : Colors.red,
  }),
});

export default style;
