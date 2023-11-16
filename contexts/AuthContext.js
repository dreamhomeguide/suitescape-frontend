import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { useSettings } from "./SettingsContext";
import SuitescapeAPI, {
  removeHeaderToken,
  setHeaderToken,
} from "../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../utilities/apiHelpers";
import { clearCacheDir } from "../utilities/cacheMedia";

const AuthContext = createContext(undefined);

const initialState = {
  isLoaded: false,
  isLoading: true,
  userToken: null,
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
    case "SIGN_IN":
      return {
        ...prevState,
        userToken: action.userToken,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        userToken: null,
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

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const abortControllerRef = useRef(null);

  const { enableOnboarding, disableOnboarding } = useSettings();

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const restoreToken = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.log("Restoring token failed", e);
      }

      if (!userToken) {
        dispatch({ type: "RESTORE_TOKEN_FINISH" });
        return;
      }

      console.log("Restored token", userToken);

      let response;
      try {
        response = await SuitescapeAPI.get("/user", {
          timeout: 5000,
          headers: { Authorization: `Bearer ${userToken}` },
        });
        handleApiResponse({ response });
      } catch (error) {
        handleApiError({ error });
      }

      // This will not wait for the request to finish
      // SuitescapeAPI.get("/user", {
      //   timeout: 5000,
      //   headers: { Authorization: `Bearer ${userToken}` },
      // })
      //   .then((res) => {
      //     response = res;
      //   })
      //   .catch((error) => {
      //     handleApiError({ error });
      //   });

      if (response?.status === 200) {
        setHeaderToken(userToken);
        console.log("User is logged in");
        dispatch({ type: "SIGN_IN", userToken });
      }

      dispatch({ type: "RESTORE_TOKEN_FINISH" });
    };

    restoreToken();
  }, []);

  const signIn = async (data) => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: "START_LOADING" });

    const AbortController = window.AbortController;
    abortControllerRef.current = new AbortController();

    try {
      const response = await SuitescapeAPI.post(
        "/login",
        { email: data.email, password: data.password },
        { signal: abortControllerRef.current.signal },
      );
      handleApiResponse({
        response,
        onError: (e) => {
          throw e.errors;
        },
        onSuccess: async (res) => {
          setHeaderToken(res.token);

          await disableOnboarding();
          await SecureStore.setItemAsync("userToken", res.token);

          dispatch({ type: "SIGN_IN", userToken: res.token });
        },
      });
    } catch (error) {
      handleApiError({
        error,
        // defaultAlert: true,
        handleErrors: (e) => {
          throw e.errors;
        },
      });
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  const signUp = async (data) => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: "START_LOADING" });

    const AbortController = window.AbortController;
    abortControllerRef.current = new AbortController();

    try {
      const response = await SuitescapeAPI.post(
        "/register",
        {
          firstname: data.firstName,
          lastname: data.lastName,
          date_of_birth: data.birthday,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
        },
        { signal: abortControllerRef.current.signal },
      );
      handleApiResponse({
        response,
        onError: (e) => {
          throw e.errors;
        },
        onSuccess: (res) => {
          if (res.user) {
            console.log(res.user);
          }
        },
      });
    } catch (error) {
      handleApiError({
        error,
        // defaultAlert: true,
        handleErrors: (e) => {
          throw e.errors;
        },
      });
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  const signOut = async () => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: "START_LOADING" });

    try {
      const response = await SuitescapeAPI.post("/logout");
      handleApiResponse({ response });
    } catch (error) {
      handleApiError({
        error,
        defaultAlert: true,
      });
    } finally {
      removeHeaderToken();

      await enableOnboarding();
      await SecureStore.deleteItemAsync("userToken");
      await clearCacheDir("videos/").then(() => {
        console.log("Cache cleared");
      });

      dispatch({ type: "FINISH_LOADING" });

      dispatch({ type: "SIGN_OUT" });
    }
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const authContext = {
    authState: state,
    signIn,
    signUp,
    signOut,
    abort,
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
