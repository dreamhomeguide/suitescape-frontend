import { Entypo } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DefaultTheme as MaterialTheme,
  PaperProvider,
} from "react-native-paper";
import { ToastProvider } from "react-native-toast-notifications";
import { HeaderButtonsProvider } from "react-navigation-header-buttons";

import { Colors } from "./assets/Colors";
import globalStyles from "./assets/styles/globalStyles";
import toastStyles from "./assets/styles/toastStyles";
import { useAuth } from "./contexts/AuthContext";
import BookingProcessProvider from "./contexts/BookingProcessProvider";
import { useSettings } from "./contexts/SettingsContext";
import MainNavigation from "./navigation/MainNavigation";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
    border: Colors.lightgray,
  },
};

const paperTheme = MaterialTheme;

const stackType = "native";

const Root = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    ...AntDesign.font,
    ...Entypo.font,
    ...FontAwesome5.font,
    ...Foundation.font,
    ...MaterialCommunityIcons.font,
  });

  const colorScheme = useColorScheme();

  const { settings } = useSettings();
  const { authState } = useAuth();

  if (!fontsLoaded || !settings.isLoaded || !authState.isLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={globalStyles.flexFull}>
      <BottomSheetModalProvider style={globalStyles.flexFull}>
        <ToastProvider
          offsetTop={StatusBar.currentHeight}
          duration={1400}
          normalColor={Colors.blue}
          style={toastStyles.toast}
          // textStyle={{ textAlign: "center" }}
        >
          <PaperProvider theme={paperTheme}>
            <NavigationContainer
              theme={colorScheme === "dark" ? DarkTheme : navigationTheme}
              onReady={() => {
                SplashScreen.hideAsync().catch((err) => console.log(err));
              }}
            >
              <HeaderButtonsProvider stackType={stackType}>
                <BookingProcessProvider>
                  <MainNavigation />
                </BookingProcessProvider>
              </HeaderButtonsProvider>
            </NavigationContainer>
          </PaperProvider>
        </ToastProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Root;
