import { Entypo } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { StatusBar } from "react-native";
import {
  DefaultTheme as MaterialTheme,
  PaperProvider,
} from "react-native-paper";
import { ToastProvider } from "react-native-toast-notifications";

import { Colors } from "./assets/Colors";
import globalStyles from "./assets/styles/globalStyles";
import { useAuth } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
import { ListingProvider } from "./contexts/ListingContext";
import { RoomProvider } from "./contexts/RoomContext";
import { useSettings } from "./contexts/SettingsContext";
import MainNavigation from "./navigation/MainNavigation";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const paperTheme = MaterialTheme;

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
  const { settings } = useSettings();
  const { authState } = useAuth();

  if (!fontsLoaded || !settings.isLoaded || !authState.isLoaded) {
    return null;
  }

  return (
    <ListingProvider>
      <RoomProvider>
        <BookingProvider>
          <ToastProvider
            offsetTop={StatusBar.currentHeight}
            duration={1400}
            normalColor={Colors.blue}
            style={globalStyles.toast}
          >
            <PaperProvider theme={paperTheme}>
              <NavigationContainer
                onReady={() => {
                  SplashScreen.hideAsync().catch((err) => console.log(err));
                }}
                theme={navigationTheme}
                // theme={colorScheme === 'dark' ? DarkTheme : theme}
              >
                <MainNavigation />
              </NavigationContainer>
            </PaperProvider>
          </ToastProvider>
        </BookingProvider>
      </RoomProvider>
    </ListingProvider>
  );
};

export default Root;
