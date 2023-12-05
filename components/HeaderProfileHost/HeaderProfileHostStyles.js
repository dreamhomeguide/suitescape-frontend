import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: {
    height: 445,
  },
  coverImageContainer: {
    backgroundColor: Colors.lightgray,
  },
  profileImageContainer: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1,
  },
  mainContentContainer: {
    transform: [{ translateY: -115 }],
  },
  contentContainer: {
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    padding: 20,
    backgroundColor: "white",
    marginTop: 60,
    paddingTop: 110,
    rowGap: 20,
  },
  nameContainer: {
    rowGap: 8,
    alignItems: "center",
  },
  hostName: {
    fontSize: 26,
    color: "black",
    fontWeight: "bold",
  },
  userName: {
    color: Colors.gray,
    fontSize: 15,
    fontWeight: "600",
  },
  overviewContainer: {
    flexDirection: "row",
    columnGap: 35,
    justifyContent: "center",
    marginBottom: 5,
  },
  overviewItemContainer: {
    alignItems: "center",
    rowGap: 8,
  },
  overviewItemCount: {
    fontWeight: "700",
    fontSize: 22,
  },
  overviewItemLabel: {
    color: Colors.gray,
    fontSize: 15,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    columnGap: 30,
    marginHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
  },
});

export default style;
