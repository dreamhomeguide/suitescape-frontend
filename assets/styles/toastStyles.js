import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  toast: {
    position: "absolute",
    borderRadius: 20,
  },
});

const toastStyles = StyleSheet.create({
  toastInsetTop: {
    ...style.toast,
    top: 10,
  },
  toastInsetBottom: {
    ...style.toast,
    bottom: 10,
  },
  toastInsetHeader: {
    ...style.toast,
    top: 65,
  },
  toastInsetFooter: {
    ...style.toast,
    bottom: 80,
  },
  ...style,
});

export default toastStyles;
