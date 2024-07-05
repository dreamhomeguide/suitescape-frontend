import { Dimensions, StyleSheet } from "react-native";

import { Colors } from "../Colors";

const { height } = Dimensions.get("window");

const globalStyles = StyleSheet.create({
  flexFull: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  absoluteCenter: {
    position: "absolute",
    zIndex: 1,
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  absoluteTop: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
  },
  absoluteBottom: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    marginTop: 0,
    margin: 15,
  },
  emptyTextCenter: {
    textAlign: "center",
    margin: 20,
    color: Colors.gray,
  },
  headerText: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  smallHeaderText: {
    color: "black",
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 15,
  },
  boldText: {
    fontWeight: "bold",
  },
  semiBoldText: {
    fontWeight: "500",
  },
  uniformGap: {
    gap: 5,
  },
  textGap: {
    rowGap: 5,
  },
  containerGap: {
    rowGap: 10,
  },
  largeContainerGap: {
    rowGap: 15,
  },
  rowGap: {
    rowGap: 3,
  },
  rowGapSmall: {
    rowGap: 1,
  },
  iconShadow: {
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
  },
  loadingCircle: {
    alignSelf: "center",
    marginVertical: 15,
  },
  coverImage: {
    height: height / 4,
    width: "100%",
    backgroundColor: Colors.lightgray,
    borderRadius: 10,
    overflow: "hidden",
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: Colors.gray,
  },
  verticalDivider: {
    height: "auto",
    width: 1.5,
    backgroundColor: Colors.lightgray,
  },
  closeModalButton: {
    position: "absolute",
    right: 25,
    zIndex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 30,
  },
  buttonRowSmall: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  swiperActionButton: {
    height: "100%",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  swiperActionText: {
    color: "white",
  },
  swiperContainer: {
    borderRadius: 10,
  },
  swiperBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    zIndex: -1,
  },
  disabledBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export const pressedOpacity = (pressed, opacity = 0.5) =>
  pressed ? { opacity } : {};
export const disabledOpacity = (disabled, opacity = 0.6) =>
  disabled ? { opacity } : {};
export const pressedBgColor = (pressed, backgroundColor = "lightgray") =>
  pressed ? { backgroundColor } : {};
export const pressedBorderColor = (pressed, borderColor = "lightgray") =>
  pressed ? { borderColor } : {};
export const pressedColor = (pressed, color = "lightgray") =>
  pressed ? { color } : {};

export default globalStyles;
