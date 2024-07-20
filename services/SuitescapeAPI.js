import axios from "axios";
// import Constants from "expo-constants";

// eslint-disable-next-line no-undef
// const hostname = new URL(
//   Constants.linkingUri || `http://${Constants.expoConfig?.hostUri}`,
// ).hostname;

// export const baseURL = `http://${hostname}/suitescape-api.test`;

export const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

export const baseURLWithAPI = baseURL + "/api";

const SuitescapeAPI = axios.create({
  baseURL: baseURLWithAPI,
  timeout: 10000,
  timeoutErrorMessage: "Connection timed out. Please check your network.",
});

export const setHeaderToken = (token) => {
  SuitescapeAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  delete SuitescapeAPI.defaults.headers.common["Authorization"];
};

export default SuitescapeAPI;
