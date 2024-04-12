import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Platform, useColorScheme } from "react-native";

import BottomTabs from "./BottomTabs/BottomTabs";
import { Routes } from "./Routes";
import { Colors } from "../assets/Colors";
import HeaderTitle from "../components/HeaderTitle/HeaderTitle";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import AvailableRooms from "../screens/AvailableRooms/AvailableRooms";
import BookingDetails from "../screens/BookingDetails/BookingDetails";
import BookingSummary from "../screens/BookingSummary/BookingSummary";
import CancelBooking from "../screens/CancelBooking/CancelBooking";
import ChangeDates from "../screens/ChangeDates/ChangeDates";
import ChangePassword from "../screens/ChangePassword/ChangePassword";
import Chat from "../screens/Chat/Chat";
import ChatSearch from "../screens/ChatSearch/ChatSearch";
import EmailVerification from "../screens/EmailVerification/EmailVerification";
import Feedback from "../screens/Feedback/Feedback";
import FeedbackApp from "../screens/FeedbackApp/FeedbackApp";
import FeedbackCancellation from "../screens/FeedbackCancellation/FeedbackCancellation";
import Filter from "../screens/Filter/Filter";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import GuestInfo from "../screens/GuestInfo/GuestInfo";
import Liked from "../screens/Liked/Liked";
import ListingDetails from "../screens/ListingDetails/ListingDetails";
import Login from "../screens/Login/Login";
import ManageAccount from "../screens/ManageAccount/ManageAccount";
import Onboarding from "../screens/Onboarding/Onboarding";
import OnboardingHost from "../screens/OnboardingHost/OnboardingHost";
import PaymentMethod from "../screens/PaymentMethod/PaymentMethod";
import ProfileHost from "../screens/ProfileHost/ProfileHost";
import RateExperience from "../screens/RateExperience/RateExperience";
import Ratings from "../screens/Ratings/Ratings";
import ResetPassword from "../screens/ResetPassword/ResetPassword";
import RoomDetails from "../screens/RoomDetails/RoomDetails";
import Saved from "../screens/Saved/Saved";
import Search from "../screens/Search/Search";
import SelectDates from "../screens/SelectDates/SelectDates";
import SignUp from "../screens/SignUp/SignUp";

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: Colors.blue,
  },
  headerTintColor: "white",
  headerBackTitleVisible: false,
  // headerBackVisible: Platform.OS === "ios",
  // headerLeft:
  //   Platform.OS === "android"
  //     ? ({ canGoBack, tintColor }) =>
  //         canGoBack && (
  //           <View style={{ marginLeft: -12, marginRight: 5 }}>
  //             <ButtonBack
  //               onPress={() => navigation.goBack()}
  //               color={tintColor}
  //             />
  //           </View>
  //         )
  //     : null,
  headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
};

const SLIDE_RIGHT_WITH_INPUT =
  Platform.OS === "ios" ? "simple_push" : "slide_from_right";

const feedbackScreenOptions = {
  gestureEnabled: false,
  headerShown: false,
  presentation: "transparentModal",
  animation: "fade",
};

const LoggedInStack = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const whiteBackground = {
    contentStyle: {
      backgroundColor: "white",
    },
  };

  const darkBackground = {
    contentStyle: {
      backgroundColor:
        colorScheme === "dark"
          ? theme.colors.background
          : Colors.backgroundGray,
    },
  };

  return (
    <Stack.Navigator initialRouteName={Routes.HOME}>
      {/* Stack of screens that has header hidden */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name={Routes.HOME} component={BottomTabs} />
        <Stack.Screen name={Routes.CHAT} component={Chat} />
      </Stack.Group>

      {/* Stack of screens that has header shown */}
      <Stack.Group screenOptions={headerOptions}>
        <Stack.Screen
          name={Routes.FEEDBACK}
          component={Feedback}
          options={feedbackScreenOptions}
        />
        <Stack.Screen
          name={Routes.SEARCH}
          component={Search}
          options={{
            title: "Search Destination",
            animation: SLIDE_RIGHT_WITH_INPUT,
            animationDuration: 250,
          }}
        />
        <Stack.Screen
          name={Routes.CHAT_SEARCH}
          component={ChatSearch}
          options={{ animation: "fade" }}
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
          name={Routes.ONBOARDING_HOST}
          component={OnboardingHost}
          options={{
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen name={Routes.MANAGE_ACCOUNT} component={ManageAccount} />
        <Stack.Screen
          name={Routes.CHANGE_PASSWORD}
          component={ChangePassword}
        />
        <Stack.Screen name={Routes.SAVED} component={Saved} />
        <Stack.Screen name={Routes.LIKED} component={Liked} />
        <Stack.Screen name={Routes.APP_FEEDBACK} component={FeedbackApp} />

        {/* Stack of screens that slide from right */}
        <Stack.Group screenOptions={{ animation: "slide_from_right" }}>
          <Stack.Group screenOptions={whiteBackground}>
            <Stack.Screen name={Routes.FILTER} component={Filter} />
            <Stack.Screen name={Routes.GUEST_INFO} component={GuestInfo} />
            <Stack.Screen
              name={Routes.PAYMENT_METHOD}
              component={PaymentMethod}
              options={{ title: "Payment" }}
            />
            <Stack.Screen name={Routes.RATINGS} component={Ratings} />
          </Stack.Group>

          <Stack.Group screenOptions={darkBackground}>
            <Stack.Screen
              name={Routes.LISTING_DETAILS}
              component={ListingDetails}
              options={{
                headerStyle: {
                  backgroundColor: "transparent",
                },
                // headerTitle: "",
                // headerShown: false,
                headerTransparent: true,
              }}
            />
            <Stack.Screen name={Routes.ROOM_DETAILS} component={RoomDetails} />
            <Stack.Screen
              name={Routes.AVAILABLE_ROOMS}
              component={AvailableRooms}
            />
            <Stack.Screen
              name={Routes.BOOKING_SUMMARY}
              component={BookingSummary}
            />
            <Stack.Screen
              name={Routes.BOOKING_DETAILS}
              component={BookingDetails}
            />
            <Stack.Screen name={Routes.CHANGE_DATES} component={ChangeDates} />
            <Stack.Screen
              name={Routes.CANCEL_BOOKING}
              component={CancelBooking}
            />
            <Stack.Screen
              name={Routes.CANCELLATION_FEEDBACK}
              component={FeedbackCancellation}
            />
            <Stack.Screen
              name={Routes.RATE_EXPERIENCE}
              component={RateExperience}
            />
            <Stack.Screen name={Routes.PROFILE_HOST} component={ProfileHost} />
          </Stack.Group>
        </Stack.Group>
      </Stack.Group>
    </Stack.Navigator>
  );
};

const MainNavigation = () => {
  const { settings } = useSettings();
  const { authState } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {settings.onboardingEnabled && (
        <Stack.Screen name={Routes.ONBOARDING} component={Onboarding} />
      )}

      {authState.userToken || settings.guestModeEnabled ? (
        <Stack.Screen name={Routes.MAIN} component={LoggedInStack} />
      ) : (
        <Stack.Group screenOptions={{ animation: "slide_from_bottom" }}>
          <Stack.Screen name={Routes.LOGIN} component={Login} />
          <Stack.Screen name={Routes.SIGNUP} component={SignUp} />
        </Stack.Group>
      )}

      {/* Screens that are accessible to both logged-in and logged-out users */}
      <Stack.Group screenOptions={headerOptions}>
        <Stack.Screen
          name={Routes.FORGOT_PASSWORD}
          component={ForgotPassword}
        />
        <Stack.Screen
          name={Routes.EMAIL_VERIFICATION}
          component={EmailVerification}
        />
        <Stack.Screen name={Routes.RESET_PASSWORD} component={ResetPassword} />

        {!authState.userToken && (
          <Stack.Screen
            name={Routes.FEEDBACK}
            component={Feedback}
            options={feedbackScreenOptions}
          />
        )}
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainNavigation;
