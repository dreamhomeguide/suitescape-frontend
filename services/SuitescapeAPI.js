import axios from "axios";

const serverIpAddress = "0.0.0.0";
// const serverIpAddress = "192.168.100.151";

export const baseURL = `http://${serverIpAddress}/suitescape-api.test`;
// export const baseURL = `https://suitescape.dream-homeseller.com`;

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
