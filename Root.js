import { Entypo } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StatusBar, useColorScheme } from "react-native";
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
import { VideoFiltersProvider } from "./contexts/VideoFiltersContext";
import MainNavigation from "./navigation/MainNavigation";
import { Routes } from "./navigation/Routes";
import { cacheAssetsAsync } from "./utils/cacheAssets";

const stackType = "native";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
    border: Colors.lightgray,
  },
};
const paperTheme = MaterialTheme;

const Root = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplashAnimation, setShowSplashAnimation] = useState(true);

  const splashTimeoutRef = useRef(null);

  const { authState } = useAuth();
  const { settings } = useSettings();
  const colorScheme = useColorScheme();
  const url = Linking.useURL();

  const config = {
    screens: {
      [Routes.MAIN]: {
        initialRouteName: Routes.HOME,
        screens: {
          [Routes.LISTING_DETAILS]: {
            path: "listings/:listingId",
          },
        },
      },
    },
  };

  const linking = {
    prefixes: [Linking.createURL("/")],
    filter: () => authState.userToken || settings.guestModeEnabled,
    config,
  };

  // Load any resources or data that you need before rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        await cacheAssetsAsync({
          images: [
            require("./assets/splash-animation.gif"),
            require("./assets/images/onboarding/host.png"),
            require("./assets/images/pngs/default-profile.png"),
          ],
          fonts: [
            AntDesign.font,
            Entypo.font,
            FontAwesome5.font,
            Foundation.font,
            MaterialCommunityIcons.font,
            { Fontello: require("./assets/fontello/Fontello.ttf") },
            {
              "Agenor-Bold": require("./assets/fonts/Agenor-Bold.ttf"),
              "Agenor-Thin": require("./assets/fonts/Agenor-Thin.ttf"),
            },
          ],
        });
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        // Signal that the app has finished loading resources
        setAppIsReady(true);

        // Hide the splash screen to show splash animation
        SplashScreen.hideAsync().catch((err) => console.log(err));
      }
    }

    loadResourcesAndDataAsync();

    return () => {
      clearTimeout(splashTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (url) {
      console.log("Linking URL:", url);
    }
  }, [url]);

  if (showSplashAnimation) {
    return (
      <ImageBackground
        onLayout={() => {
          splashTimeoutRef.current = setTimeout(() => {
            setShowSplashAnimation(false);
          }, 4000);
        }}
        contentFit="contain"
        source={require("./assets/splash-animation.gif")}
        style={globalStyles.flexFull}
      />
    );
  }

  if (!appIsReady || !settings.isLoaded || !authState.isLoaded) {
    return (
      <ActivityIndicator
        color="black"
        size="large"
        style={globalStyles.flexCenter}
      />
    );
  }

  return (
    <GestureHandlerRootView style={globalStyles.flexFull}>
      <BottomSheetModalProvider>
        <ToastProvider
          offsetTop={StatusBar.currentHeight}
          duration={1400}
          normalColor={Colors.transparentblue}
          style={toastStyles.toast}
        >
          <PaperProvider theme={paperTheme}>
            {/*{!isNavigationReady && (*/}
            {/*  <ActivityIndicator*/}
            {/*    color="black"*/}
            {/*    size="large"*/}
            {/*    style={globalStyles.flexCenter}*/}
            {/*  />*/}
            {/*)}*/}

            <NavigationContainer
              linking={linking}
              theme={colorScheme === "dark" ? DarkTheme : navigationTheme}
              // onReady={() => setIsNavigationReady(true)}
            >
              <HeaderButtonsProvider stackType={stackType}>
                <BookingProcessProvider>
                  <VideoFiltersProvider>
                    <MainNavigation />
                  </VideoFiltersProvider>
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
