import axios from "axios";
// import * as Linking from "expo-linking";

// eslint-disable-next-line no-undef
// const serverIpAddress = new URL(Linking.createURL("/")).hostname;

// export const baseURL = `http://${serverIpAddress}/suitescape-api.test`;
export const baseURL = `https://suitescape.dream-homeseller.com`;

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
