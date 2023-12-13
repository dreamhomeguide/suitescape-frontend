import axios from "axios";

// Replace this with your local/private IP Address
// const serverIpAddress = "192.168.100.151";
// const serverIpAddress = "192.168.1.112";

// export const baseURL = `http://${serverIpAddress}/suitescape-api.test/api`;

export const baseURL = `https://suitescape.dream-homeseller.com/api`;

const SuitescapeAPI = axios.create({
  baseURL,
});

export const getHeaderToken = () => {
  return SuitescapeAPI.defaults.headers.common["Authorization"];
};

export const setHeaderToken = (token) => {
  SuitescapeAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  delete SuitescapeAPI.defaults.headers.common["Authorization"];
};

export default SuitescapeAPI;
