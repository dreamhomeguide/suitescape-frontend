import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useReducer } from "react";

const SettingsContext = createContext(undefined);

const initialState = {
  isLoaded: false,
  onboardingEnabled: true,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case "SET_ONBOARDING":
      return {
        ...prevState,
        onboardingEnabled: action.onboardingEnabled,
      };
    case "RESTORE_SETTINGS":
      return {
        ...prevState,
        ...action.settings,
        isLoaded: true,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  useEffect(() => {
    const getSettings = async () => {
      const settings = {};

      try {
        const storedOnboardingEnabled =
          await SecureStore.getItemAsync("onboardingEnabled");
        if (!storedOnboardingEnabled) {
          await SecureStore.setItemAsync("onboardingEnabled", "true");
          settings.onboardingEnabled = true;
        } else {
          settings.onboardingEnabled = storedOnboardingEnabled === "true";
        }
      } catch (err) {
        console.log(err);
      }

      console.log("Restored settings", settings);
      dispatch({ type: "RESTORE_SETTINGS", settings });
    };

    getSettings();
  }, []);

  const enableOnboarding = async () => {
    await SecureStore.setItemAsync("onboardingEnabled", "true");
    dispatch({ type: "SET_ONBOARDING", onboardingEnabled: true });
  };

  const disableOnboarding = async () => {
    await SecureStore.setItemAsync("onboardingEnabled", "false");
    dispatch({ type: "SET_ONBOARDING", onboardingEnabled: false });
  };

  const settingsContext = {
    settings: state,
    enableOnboarding,
    disableOnboarding,
  };

  return (
    <SettingsContext.Provider value={settingsContext}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
