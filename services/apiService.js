import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import SuitescapeAPI from "./SuitescapeAPI";
import { fetchFromAPI } from "../utils/apiHelpers";

/***********************
 *                     *
 *       Queries       *
 *                     *
 ***********************/

export const fetchVideos = async ({ pageParam = "", videoFilters }) => {
  console.log(
    `Fetching videos... ${pageParam ? `(Cursor: ${pageParam})` : ""}`,
  );

  if (videoFilters) {
    console.log("Video Filters: ", videoFilters);
  }

  try {
    const { data, request } = await SuitescapeAPI.get("/videos/feed", {
      params: {
        cursor: pageParam,
        ...videoFilters,
      },
    });
    console.log("AUTHORIZATION:", request._headers.authorization);

    return data;
  } catch (error) {
    Alert.alert("Error fetching videos", error.response.data.message);
    console.log(error.response.data);

    throw error;
  }
};

export const fetchProfile = async ({ signal }) => {
  const { data } = await fetchFromAPI({ endpoint: "/profile", signal });
  return data;
};

export const fetchAllChats = async () => {
  const { data } = await fetchFromAPI({ endpoint: "/messages" });
  return data;
};

export const fetchAllMessages = async (hostId) => {
  const { data } = await fetchFromAPI({ endpoint: `/messages/${hostId}` });
  return data;
};

export const fetchAllBookings = async () => {
  const { data } = await fetchFromAPI({ endpoint: "/bookings" });
  return data;
};

export const fetchBooking = async (bookingId) => {
  const { data } = await fetchFromAPI({ endpoint: `/bookings/${bookingId}` });
  return data;
};

export const fetchLikedListings = async () => {
  const { data } = await fetchFromAPI({
    endpoint: `/profile/liked`,
  });
  return data;
};

export const fetchSavedListings = async () => {
  const { data } = await fetchFromAPI({
    endpoint: `/profile/saved`,
  });
  return data;
};

export const fetchHost = async (hostId) => {
  const { data } = await fetchFromAPI({ endpoint: `/hosts/${hostId}` });
  return data;
};

export const fetchListing = async (listingId) => {
  const { data } = await fetchFromAPI({
    endpoint: `/listings/${listingId}`,
  });
  return data;
};

export const fetchRoom = async (roomId) => {
  const { data } = await fetchFromAPI({ endpoint: `/rooms/${roomId}` });
  return data;
};

export const fetchListingRooms = async (listingId, startDate, endDate) => {
  const { data } = await fetchFromAPI({
    endpoint: `/listings/${listingId}/rooms`,
    config: {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    },
  });
  return data;
};

export const fetchListingReviews = async (listingId) => {
  const { data } = await fetchFromAPI({
    endpoint: `/listings/${listingId}/reviews`,
  });
  return data;
};

export const fetchRoomReviews = async (roomId) => {
  const { data } = await fetchFromAPI({ endpoint: `/rooms/${roomId}/reviews` });
  return data;
};

export const fetchConstant = async (key) => {
  const { data } = await fetchFromAPI({ endpoint: `/constants/${key}` });
  return data;
};

/***********************
 *                     *
 *     Mutations       *
 *                     *
 ***********************/

export const sendMessage = async ({ hostId, content }) => {
  return await SuitescapeAPI.post(`/messages/send`, {
    receiver_id: hostId,
    content,
  });
};

export const likeListing = async ({ listingId }) => {
  return await SuitescapeAPI.post(`/listings/${listingId}/like`);
};

export const saveListing = async ({ listingId }) => {
  return await SuitescapeAPI.post(`/listings/${listingId}/save`);
};

export const searchListings = async ({ query, signal }) => {
  return await fetchFromAPI({
    endpoint: "/listings/search",
    config: {
      params: {
        search_query: query,
      },
    },
    signal,
  });
};

export const incrementViewCount = async ({ listingId }) => {
  return await SuitescapeAPI.post(`/listings/${listingId}/view`);
};

export const createBooking = async ({ bookingData }) => {
  return await SuitescapeAPI.post("/bookings", bookingData);
};

export const updateBookingStatus = async ({ bookingId, status }) => {
  return await SuitescapeAPI.post(`/bookings/${bookingId}/update-status`, {
    booking_status: status,
  });
};

export const updateBookingDates = async ({ bookingId, startDate, endDate }) => {
  return await SuitescapeAPI.post(`/bookings/${bookingId}/update-dates`, {
    start_date: startDate,
    end_date: endDate,
  });
};

export const updateBookingPaymentStatus = async ({ bookingId, status }) => {
  return await SuitescapeAPI.post(
    `/bookings/${bookingId}/update-payment-status`,
    {
      payment_status: status,
    },
  );
};

export const createReview = async ({
  listingId,
  roomId,
  feedback,
  overallRating,
  serviceRatings,
}) => {
  return await SuitescapeAPI.post(`/reviews`, {
    listing_id: listingId,
    room_id: roomId,
    feedback,
    overall_rating: overallRating,
    ...serviceRatings,
  });
};

export const updateProfile = async ({ profileData }) => {
  return await SuitescapeAPI.post("/profile/update", profileData);
};

export const validateInfo = async ({ profileData }) => {
  return await SuitescapeAPI.post("/profile/validate", profileData);
};

export const changePassword = async ({
  currentPassword,
  newPassword,
  newPasswordConfirmation,
}) => {
  return await SuitescapeAPI.post("/profile/update-password", {
    current_password: currentPassword,
    new_password: newPassword,
    new_password_confirmation: newPasswordConfirmation,
  });
};

export const updateActiveStatus = async ({ isActive }) => {
  return await SuitescapeAPI.post("/profile/update-active-session", {
    active: isActive,
    device_name: Device.modelName,
    device_id: SecureStore.getItem("deviceId"),
  });
};

export const sendResetCode = async ({ email }) => {
  return await SuitescapeAPI.post("/forgot-password", { email });
};

export const validateCode = async ({ email, code }) => {
  return await SuitescapeAPI.post("/validate-reset-token", {
    email,
    token: code,
  });
};

export const resetPassword = async ({
  email,
  code,
  newPassword,
  newPasswordConfirmation,
}) => {
  return await SuitescapeAPI.post("/reset-password", {
    email,
    token: code,
    new_password: newPassword,
    new_password_confirmation: newPasswordConfirmation,
  });
};

// export const updateConstant = async ({ key, value }) => {
//   return await SuitescapeAPI.post(`/constants/${key}`, { value });
// };
