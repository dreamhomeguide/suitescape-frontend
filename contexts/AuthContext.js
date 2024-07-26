// noinspection JSCheckFunctionSignatures

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { Alert, AppState } from "react-native";

import { useSettings } from "./SettingsContext";
import * as RootNavigation from "../navigation/RootNavigation";
import { Routes } from "../navigation/Routes";
import { removeBearerToken, setBearerToken } from "../services/PusherEcho";
import SuitescapeAPI, {
  removeHeaderToken,
  setHeaderToken,
} from "../services/SuitescapeAPI";
import { updateActiveStatus } from "../services/apiService";
import { handleApiError, handleApiResponse } from "../utils/apiHelpers";

const initialState = {
  isLoaded: false,
  isLoading: true,
  userId: "",
  userToken: "",
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case "START_LOADING":
      return {
        ...prevState,
        isLoading: true,
      };
    case "FINISH_LOADING":
      return {
        ...prevState,
        isLoading: false,
      };
    case "SET_USER_ID":
      return {
        ...prevState,
        userId: action.userId,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        userToken: action.userToken,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        userId: "",
        userToken: "",
      };
    case "RESTORE_TOKEN_FINISH":
      return {
        ...prevState,
        isLoaded: true,
        isLoading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const AuthContext = createContext({
  authState: initialState,
  signIn: async (_data) => {},
  signUp: async (_data) => {},
  signOut: async () => {},
  enableGuestMode: async () => {},
  disableGuestMode: () => {},
  // abort: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  // const abortControllerRef = useRef(null);
  const onActiveStatusListener = useRef(null);
  const interceptorId = useRef(null);

  const { modifySetting } = useSettings();
  const queryClient = useQueryClient();

  // Validate the token and login the user
  const validateToken = async (userToken) => {
    let response;
    try {
      response = await SuitescapeAPI.get("/user", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
    } catch (error) {
      handleApiError({ error, defaultAlert: true });

      // Set the response to the error response
      response = error.response;
    }

    if (response?.status === 200) {
      const { id: userId, email_verified_at: emailVerifiedAt } = response.data;

      // Login the user
      await handleLogin(userToken, userId, emailVerifiedAt);
      console.log("User is logged in");
    } else if (response?.status === 401) {
      // Remove the expired token from storage
      await SecureStore.deleteItemAsync("userToken");

      // Alert.alert(
      //   "Session expired",
      //   "Please log in again to continue using Suitescape.",
      //   [{ text: "OK" }],
      // );
    }
  };

  // Fetch the token from storage and validate it
  const restoreToken = async () => {
    let userToken;
    try {
      userToken = SecureStore.getItem("userToken");
    } catch (e) {
      console.log("Restoring token failed", e);
    }

    if (!userToken) {
      console.log("No token found");
      dispatch({ type: "RESTORE_TOKEN_FINISH" });
      return;
    }
    console.log("Restored token", userToken);

    await validateToken(userToken);

    dispatch({ type: "RESTORE_TOKEN_FINISH" });
  };

  useEffect(() => {
    restoreToken();
  }, []);

  const handleLogin = async (userToken, userId, emailVerifiedAt) => {
    if (!emailVerifiedAt) {
      Alert.alert(
        "Email not verified",
        "Please verify your email to continue using Suitescape.",
        [
          { text: "OK", style: "cancel" },
          { text: "Resend email", onPress: () => resendEmail(userToken) },
        ],
      );

      dispatch({ type: "FINISH_LOADING" });
      return;
    }

    // Add the user's id to the state
    dispatch({ type: "SET_USER_ID", userId });

    // Save the token to storage
    if (SecureStore.getItem("userToken") !== userToken) {
      SecureStore.setItem("userToken", userToken);
    }

    // Set the token to the SuitescapeAPI instance
    setHeaderToken(userToken);

    // Set the token to the PusherEcho instance
    setBearerToken(userToken);

    // Add interceptors for the response to check if the token is expired
    addExpiredTokenInterceptors();

    // Update the user's active status to true
    try {
      const { data } = await updateActiveStatus({ isActive: true });
      console.log("User is active:", data.user.fullname);
    } catch (error) {
      console.log("Failed to update active status", error);
    }

    // Add a listener to update the user's active status when the app is focused
    addOnFocusActiveStatusListener();

    // Disable onboarding so it won't be shown again
    modifySetting("onboardingEnabled", false);

    // Reset all queries to refetch all the data
    try {
      await queryClient.resetQueries();
      console.log("Reset queries successful");
      dispatch({ type: "SIGN_IN", userToken });
    } catch (error) {
      console.error("Reset queries failed", error);
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  // const handleSignUp = async (userToken, userId, navigation) => {
  //   await handleLogin(userToken, userId, false);
  //
  //   // Waits for the login to finish
  //   await new Promise((resolve) => setTimeout(resolve, 20));
  //
  //   // So that feedback screen can be shown after the signup
  //   RootNavigation.navigate(Routes.FEEDBACK, {
  //     type: "success",
  //     title: "Congratulations",
  //     subtitle: "Your account has been created.",
  //   });
  // };

  const handleLogOut = async () => {
    // Remove the token from the SuitescapeAPI instance
    removeHeaderToken();

    // Remove the token from the PusherEcho instance
    removeBearerToken();

    // Remove the interceptors for the response
    removeExpiredTokenInterceptors();

    // Remove the listener to update the user's active status when the app is focused
    removeOnFocusActiveStatusListener();

    // Clear the token from storage
    await SecureStore.deleteItemAsync("userToken");

    // Clear all recently searched destinations
    await AsyncStorage.removeItem("recentSearches");

    // Disable host mode
    modifySetting("hostModeEnabled", false);

    // Clear the image cache
    // await Image.clearMemoryCache();
    // await Image.clearDiskCache();

    dispatch({ type: "FINISH_LOADING" });
    dispatch({ type: "SIGN_OUT" });

    // Enable onboarding so when the user quits the app while not logged in,
    // the onboarding will be shown again
    // await modifySetting("onboardingEnabled", true);
  };

  const enableGuestMode = async () => {
    await queryClient.resetQueries();
    modifySetting("guestModeEnabled", true);
  };

  const disableGuestMode = () => {
    modifySetting("guestModeEnabled", false);
  };

  const signIn = async (data) => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: "START_LOADING" });

    // Create a new abort controller for this request
    // const AbortController = window.AbortController;
    // abortControllerRef.current = new AbortController();

    let response;

    try {
      response = await SuitescapeAPI.post(
        "/login",
        { email: data.email, password: data.password },
        // { signal: abortControllerRef.current.signal },
      );

      // Validate and login the user
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log("Login response:", res);
          const {
            token: userToken,
            user: { id: userId, email_verified_at: emailVerifiedAt },
          } = res;

          await handleLogin(userToken, userId, emailVerifiedAt);

          // Save the email to the secure store, so it can be used in the login screen
          SecureStore.setItem("lastEmailLoggedIn", data.email);
        },
      });
    } catch (error) {
      handleApiError({
        error,
        defaultAlert: true,
        defaultAlertTitle: "Login error",
        handleErrors: (e) => {
          dispatch({ type: "FINISH_LOADING" });
          throw e.errors;
        },
      });
    }
  };

  const signUp = async (data) => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: "START_LOADING" });

    // Create a new abort controller for this request
    // const AbortController = window.AbortController;
    // abortControllerRef.current = new AbortController();

    let response;

    try {
      response = await SuitescapeAPI.post(
        "/register",
        {
          firstname: data.firstName,
          lastname: data.lastName,
          // date_of_birth: convertMMDDYYYY(data.birthday),
          date_of_birth: data.birthday,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
        },
        // { signal: abortControllerRef.current.signal },
      );

      // Login the user after successful validation and registration
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log("Signup response:", res);
          // await handleSignUp(res.token, res.user.id, navigation);
          dispatch({ type: "FINISH_LOADING" });

          Alert.alert(
            "Verify email",
            "Please check your email to verify your account.",
            [{ text: "OK" }],
          );

          // Navigate to the login screen
          RootNavigation.navigate(Routes.LOGIN);

          // Save the email to the secure store, so it can be used in the login screen
          SecureStore.setItem("lastEmailLoggedIn", data.email);
        },
      });
    } catch (error) {
      handleApiError({
        error,
        defaultAlert: true,
        defaultAlertTitle: "Registration error",
        handleErrors: (e) => {
          dispatch({ type: "FINISH_LOADING" });
          throw e.errors;
        },
      });
    }
  };

  const signOut = async (expired = false) => {
    // If the token is expired, just log out the user
    if (expired) {
      await handleLogOut();
      return;
    }

    if (state.isLoading) {
      return;
    }
    dispatch({ type: "START_LOADING" });

    // If the user is in guest mode, just disable it
    // if (settings.guestModeEnabled) {
    //   dispatch({ type: "FINISH_LOADING" });
    //
    //   disableGuestMode();
    //
    //   // Enable onboarding here, so it will be shown again when the user quits the app
    //   // await modifySetting("onboardingEnabled", true);
    //   return;
    // }

    // Update the active status to false
    try {
      const { data } = await updateActiveStatus({ isActive: false });
      console.log("User is inactive:", data.user.fullname);
    } catch (error) {
      console.log("Failed to update active status", error);
    }

    try {
      // Logout the user from the server,
      await SuitescapeAPI.post("/logout");
    } catch (error) {
      handleApiError({
        error,
        defaultAlert: true,
      });
    } finally {
      // Logout the user from the app
      await handleLogOut();
    }
  };

  const resendEmail = async (userToken) => {
    let response;
    try {
      response = await SuitescapeAPI.post("/email/resend", null, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
    } catch (error) {
      handleApiError({
        error,
        defaultAlert: true,
      });
    }

    if (response?.status === 200) {
      Alert.alert(
        "Email resent",
        "Please check your email to verify your account.",
        [{ text: "OK" }],
      );
    }
  };

  const addExpiredTokenInterceptors = () => {
    if (interceptorId.current) {
      console.log("Expired token interceptors already added");
      return;
    }
    interceptorId.current = SuitescapeAPI.interceptors.response.use(
      (response) => {
        // Just return the response and don't do anything
        return response;
      },
      async (error) => {
        if (error.response && error.response.status === 401) {
          // Token is expired, log out the user
          await signOut(true);
        }
        return Promise.reject(error);
      },
    );
  };

  const addOnFocusActiveStatusListener = () => {
    if (onActiveStatusListener.current) {
      console.log("On focus active status listener already added");
      return;
    }
    onActiveStatusListener.current = AppState.addEventListener(
      "change",
      (nextAppState) => {
        (async () => {
          try {
            if (nextAppState.match(/inactive|background/)) {
              await updateActiveStatus({ isActive: false });
              console.log("User left the app and is now inactive");
            } else {
              await updateActiveStatus({ isActive: true });
              console.log("User came back to the app and is now active");
            }
          } catch (err) {
            console.log(err);
          }
        })();
      },
    );
  };

  const removeExpiredTokenInterceptors = () => {
    if (interceptorId.current) {
      SuitescapeAPI.interceptors.response.eject(interceptorId.current);
      interceptorId.current = null;
    }
  };

  const removeOnFocusActiveStatusListener = () => {
    if (onActiveStatusListener.current) {
      onActiveStatusListener.current.remove();
      onActiveStatusListener.current = null;
    }
  };

  // const abort = () => {
  //   if (abortControllerRef.current) {
  //     abortControllerRef.current.abort();
  //   }
  // };

  const authContext = {
    authState: state,
    enableGuestMode,
    disableGuestMode,
    signIn,
    signUp,
    signOut,
    // abort,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
