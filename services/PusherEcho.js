import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { baseURLWithAPI } from "./SuitescapeAPI";

const PusherEcho = new Echo({
  Pusher,
  broadcaster: "pusher",
  key: "ff3bf8283e530b7f93b9",
  cluster: "ap1",
  forceTLS: true,
  authEndpoint: baseURLWithAPI + "/broadcasting/auth",
});

export const setBearerToken = (token) => {
  PusherEcho.connector.options.auth.headers.Authorization = "Bearer " + token;
};

export const removeBearerToken = () => {
  delete PusherEcho.connector.options.auth.headers.Authorization;
};

export default PusherEcho;
