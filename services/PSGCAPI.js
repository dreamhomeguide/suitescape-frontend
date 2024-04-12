import axios from "axios";

const PSGCAPI = axios.create({
  baseURL: "https://psgc.gitlab.io/api",
});

export const fetchRegions = async () => {
  const { data } = await PSGCAPI.get("/regions");
  return data;
};

export const fetchCities = async (regionCode) => {
  const { data } = await PSGCAPI.get(`/regions/${regionCode}/cities`);
  return data;
};
