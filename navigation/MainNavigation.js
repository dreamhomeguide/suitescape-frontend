import { DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import BottomTabs from "./BottomTabs/BottomTabs";
import { Routes } from "./Routes";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import BookingSummary from "../screens/BookingSummary/BookingSummary";
import CheckAvailability from "../screens/CheckAvailability/CheckAvailability";
import Feedback from "../screens/Feedback/Feedback";
import GuestInfo from "../screens/GuestInfo/GuestInfo";
import ListingDetails from "../screens/ListingDetails/ListingDetails";
import Login from "../screens/Login/Login";
import Onboarding from "../screens/Onboarding/Onboarding";
import PaymentMethod from "../screens/PaymentMethod/PaymentMethod";
import ProfileHost from "../screens/ProfileHost/ProfileHost";
import RoomDetails from "../screens/RoomDetails/RoomDetails";
import SelectDates from "../screens/SelectDates/SelectDates";
import SignUp from "../screens/SignUp/SignUp";

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const { settings } = useSettings();
  const { authState } = useAuth();

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
            contentStyle: { backgroundColor: DefaultTheme.colors.background },
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

        <Stack.Screen
          name={Routes.GUEST_INFO}
          component={GuestInfo}
          options={{ contentStyle: { backgroundColor: "white" } }}
        />
        <Stack.Screen
          name={Routes.PAYMENT_METHOD}
          component={PaymentMethod}
          options={{ contentStyle: { backgroundColor: "white" } }}
        />
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
    </Stack.Navigator>
  );
};

export default MainNavigation;
