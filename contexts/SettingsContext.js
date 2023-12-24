import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useReducer } from "react";

const SettingsContext = createContext(undefined);

const initialState = {
  isLoaded: false,
  onboardingEnabled: true,
  guestModeEnabled: false,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case "MODIFY_SETTING":
      return {
        ...prevState,
        [action.setting]: action.value,
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

  const getSetting = async (settingName, defaultValue) => {
    const storedSetting = await SecureStore.getItemAsync(settingName);

    if (!storedSetting) {
      await SecureStore.setItemAsync(settingName, String(defaultValue));
      return defaultValue;
    }

    // Return the stored setting as a boolean
    if (storedSetting === "true" || storedSetting === "false") {
      return storedSetting === "true";
    }

    // Return the stored setting as a string
    return storedSetting;
  };

  useEffect(() => {
    const getSettings = async () => {
      const settings = {};

      console.log("Restoring settings...");
      try {
        settings.onboardingEnabled = await getSetting(
          "onboardingEnabled",
          true,
        );
        settings.guestModeEnabled = await getSetting("guestModeEnabled", false);
      } catch (err) {
        console.log(err);
      }

      console.log("Restored settings", settings);
      dispatch({ type: "RESTORE_SETTINGS", settings });
    };

    getSettings();
  }, []);

  const modifySetting = async (setting, value) => {
    await SecureStore.setItemAsync(setting, String(value));
    dispatch({
      type: "MODIFY_SETTING",
      setting,
      value,
    });
  };

  const settingsContext = {
    settings: state,
    modifySetting,
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
