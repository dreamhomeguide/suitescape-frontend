import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useColorScheme } from "react-native";

import BottomTabs from "./BottomTabs/BottomTabs";
import { Routes } from "./Routes";
import { Colors } from "../assets/Colors";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import BookingSummary from "../screens/BookingSummary/BookingSummary";
import Chat from "../screens/Chat/Chat";
import CheckAvailability from "../screens/CheckAvailability/CheckAvailability";
import Feedback from "../screens/Feedback/Feedback";
import GuestInfo from "../screens/GuestInfo/GuestInfo";
import ListingDetails from "../screens/ListingDetails/ListingDetails";
import Login from "../screens/Login/Login";
import MessagesSearch from "../screens/MessagesSearch/MessagesSearch";
import Onboarding from "../screens/Onboarding/Onboarding";
import PaymentMethod from "../screens/PaymentMethod/PaymentMethod";
import ProfileHost from "../screens/ProfileHost/ProfileHost";
import RoomDetails from "../screens/RoomDetails/RoomDetails";
import Search from "../screens/Search/Search";
import SelectDates from "../screens/SelectDates/SelectDates";
import SignUp from "../screens/SignUp/SignUp";

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const navigation = useNavigation();
  const { settings } = useSettings();
  const { authState } = useAuth();

  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {settings.onboardingEnabled && (
        <Stack.Screen name={Routes.ONBOARDING} component={Onboarding} />
      )}

      {authState.userToken ? (
        <Stack.Screen name={Routes.BOTTOM_TABS} component={BottomTabs} />
      ) : (
        <Stack.Group screenOptions={{ animation: "slide_from_bottom" }}>
          <Stack.Screen name={Routes.LOGIN} component={Login} />
          <Stack.Screen name={Routes.SIGNUP} component={SignUp} />
        </Stack.Group>
      )}
      <Stack.Group
        screenOptions={{
          animation: "slide_from_right",
        }}
      >
        <Stack.Group
          screenOptions={{
            contentStyle: {
              backgroundColor:
                colorScheme === "dark"
                  ? theme.colors.background
                  : Colors.backgroundGray,
            },
          }}
        >
          <Stack.Screen
            name={Routes.LISTING_DETAILS}
            component={ListingDetails}
          />
          <Stack.Screen name={Routes.ROOM_DETAILS} component={RoomDetails} />
          <Stack.Screen
            name={Routes.CHECK_AVAILABILITY}
            component={CheckAvailability}
          />
          <Stack.Screen
            name={Routes.BOOKING_SUMMARY}
            component={BookingSummary}
          />
          <Stack.Screen name={Routes.PROFILE_HOST} component={ProfileHost} />
        </Stack.Group>

        <Stack.Screen name={Routes.SEARCH} component={Search} />
        <Stack.Screen name={Routes.GUEST_INFO} component={GuestInfo} />
        <Stack.Screen name={Routes.PAYMENT_METHOD} component={PaymentMethod} />
      </Stack.Group>

      <Stack.Screen
        name={Routes.FEEDBACK}
        component={Feedback}
        options={{
          animation: "fade_from_bottom",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name={Routes.SELECT_DATES}
        component={SelectDates}
        options={{
          animation: "fade_from_bottom",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name={Routes.CHAT}
        component={Chat}
        options={{
          animation: "fade",
          gestureEnabled: true,
        }}
      />

      <Stack.Screen
        name={Routes.SEARCH_MESSAGES}
        component={MessagesSearch}
        options={{
          headerTitle: "Search",
          animation: "fade",
          gestureEnabled: true,
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              onPress={() => navigation.goBack()}
              style={{ marginRight: 10 }}
              name="chevron-back-outline"
              size={30}
              color="black"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
