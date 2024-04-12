// noinspection JSCheckFunctionSignatures

import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useReducer } from "react";

import { cleanUpCache } from "../utils/cacheMedia";

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

const SettingsContext = createContext({
  settings: initialState,
  modifySetting: (_setting, _value) => {},
});

export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  useEffect(() => {
    const getSetting = (settingName, defaultValue) => {
      const storedSetting = SecureStore.getItem(settingName);

      if (!storedSetting) {
        SecureStore.setItem(settingName, String(defaultValue));
        return defaultValue;
      }

      // Return the stored setting as a boolean
      if (storedSetting === "true" || storedSetting === "false") {
        return storedSetting === "true";
      }

      // Return the stored setting as a string
      return storedSetting;
    };

    const restoreSettings = () => {
      const settings = {};

      try {
        settings.deviceId = getSetting("deviceId", Crypto.randomUUID());
        settings.onboardingEnabled = getSetting("onboardingEnabled", true);
        settings.guestModeEnabled = getSetting("guestModeEnabled", false);
      } catch (err) {
        console.log(err);
      }

      console.log("Restored settings", settings);
      dispatch({ type: "RESTORE_SETTINGS", settings });
    };

    restoreSettings();
    cleanUpCache().catch((err) => console.log(err));
  }, []);

  const modifySetting = (setting, value) => {
    SecureStore.setItem(setting, String(value));

    dispatch({ type: "MODIFY_SETTING", setting, value });
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
