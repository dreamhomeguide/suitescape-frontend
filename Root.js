import {
  AntDesign,
  Entypo,
  FontAwesome6,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";
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
import { CreateListingProvider } from "./contexts/CreateListingContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { useSettings } from "./contexts/SettingsContext";
import { TimerProvider } from "./contexts/TimerContext";
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
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [fontsLoaded] = useFonts({
    Fontello: require("./assets/fontello/Fontello.ttf"),
    "Agenor-Bold": require("./assets/fonts/Agenor-Bold.ttf"),
    "Agenor-Thin": require("./assets/fonts/Agenor-Thin.ttf"),
    ...AntDesign.font,
    ...Entypo.font,
    ...FontAwesome6.font,
    ...Foundation.font,
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });

  const [showSplashAnimation, setShowSplashAnimation] = useState(true);

  const splashTimeoutRef = useRef(null);

  const { authState } = useAuth();
  const { settings } = useSettings();
  const colorScheme = useColorScheme();
  const url = Linking.useURL();

  const config = {
    screens: {
      [Routes.MAIN]: {
        initialRouteName: Routes.HOME_GUEST,
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
            require("./assets/images/onboarding/host-page.png"),
            require("./assets/images/onboarding/page1.png"),
            require("./assets/images/onboarding/page2.png"),
            require("./assets/images/onboarding/page3.png"),
            require("./assets/images/pngs/default-profile.png"),
          ],
        });
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        // Signal that the app has finished loading resources
        setAssetsLoaded(true);

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
      <LottieView
        onAnimationFinish={() => {
          setShowSplashAnimation(false);
        }}
        duration={1500}
        source={require("./assets/suitescape-splash.json")}
        style={globalStyles.flexFull}
        loop={false}
        autoPlay
      />
    );
  }

  if (
    !assetsLoaded ||
    !fontsLoaded ||
    !settings.isLoaded ||
    !authState.isLoaded
  ) {
    return (
      <ActivityIndicator
        color={Colors.gray}
        size="large"
        style={globalStyles.flexCenter}
      />
    );
  }

  return (
    <GestureHandlerRootView style={globalStyles.flexFull}>
      <ToastProvider
        offsetTop={StatusBar.currentHeight}
        normalColor={Colors.transparentblue}
        style={toastStyles.toast}
        duration={1400}
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
                <CreateListingProvider>
                  <VideoFiltersProvider>
                    <TimerProvider>
                      <NotificationsProvider>
                        <BottomSheetModalProvider>
                          <MainNavigation />
                        </BottomSheetModalProvider>
                      </NotificationsProvider>
                    </TimerProvider>
                  </VideoFiltersProvider>
                </CreateListingProvider>
              </BookingProcessProvider>
            </HeaderButtonsProvider>
          </NavigationContainer>
        </PaperProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
};

export default Root;
