import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import _ from "lodash";
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
    console.log("Video Filters:", videoFilters);
  }

  try {
    const { data, request } = await SuitescapeAPI.get("/videos/feed", {
      params: {
        cursor: pageParam,
        ...videoFilters,
      },
    });
    console.log("Feed Order:", data.order);
    console.log("AUTHORIZATION:", request._headers.authorization);

    if (data.order === "default") {
      return {
        ...data,
        data: _.shuffle(data.data),
      };
    }

    return data;
  } catch (error) {
    Alert.alert("Error fetching videos", error.response.data.message);
    console.log(error.response.data);

    throw error;
  }
};

export const fetchAllPackages = async () => {
  const { data } = await fetchFromAPI({ endpoint: "/packages" });
  return data;
};

export const fetchPackage = async (packageId) => {
  const { data } = await fetchFromAPI({ endpoint: `/packages/${packageId}` });
  return data;
};

export const fetchProfile = async ({ signal }) => {
  const { data } = await fetchFromAPI({ endpoint: "/profile", signal });
  return data;
};

export const fetchAllChats = async () => {
  const { data } = await fetchFromAPI({ endpoint: "/messages" });
  return data;
};

export const fetchAllMessages = async (userId) => {
  const { data } = await fetchFromAPI({ endpoint: `/messages/${userId}` });
  return data;
};

export const fetchHostBookings = async () => {
  const { data } = await fetchFromAPI({ endpoint: "/bookings/host" });
  return data;
};

export const fetchUserBookings = async () => {
  const { data } = await fetchFromAPI({ endpoint: "/bookings/user" });
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

export const fetchHostListings = async () => {
  const { data } = await fetchFromAPI({ endpoint: `/listings/host` });
  return data;
};

export const fetchListing = async ({ listingId, startDate, endDate }) => {
  const params = {};
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }

  const { data } = await fetchFromAPI({
    endpoint: `/listings/${listingId}`,
    config: {
      params,
    },
  });
  return data;
};

export const fetchRoom = async ({ roomId, startDate, endDate }) => {
  const params = {};
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }

  const { data } = await fetchFromAPI({
    endpoint: `/rooms/${roomId}`,
    config: { params },
  });
  return data;
};

export const fetchListingRooms = async ({ listingId, startDate, endDate }) => {
  const params = {};
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }

  const { data } = await fetchFromAPI({
    endpoint: `/listings/${listingId}/rooms`,
    config: {
      params,
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

// export const fetchListingUnavailableDatesFromRange = async ({
//   listingId,
//   startDate,
//   endDate,
// }) => {
//   const { data } = await fetchFromAPI({
//     endpoint: `/listings/${listingId}/unavailable-dates`,
//     config: {
//       params: {
//         start_date: startDate,
//         end_date: endDate,
//       },
//     },
//   });
//   return data;
// };
//
// export const fetchRoomUnavailableDatesFromRange = async ({
//   roomId,
//   startDate,
//   endDate,
// }) => {
//   const { data } = await fetchFromAPI({
//     endpoint: `/rooms/${roomId}/unavailable-dates`,
//     config: {
//       params: {
//         start_date: startDate,
//         end_date: endDate,
//       },
//     },
//   });
//   return data;
// };

export const fetchYearlyEarnings = async ({ year, hostId, listingId }) => {
  const { data } = await fetchFromAPI({
    endpoint: `/earnings/${year}`,
    config: {
      params: {
        host_id: hostId,
        listing_id: listingId,
      },
    },
  });
  return data;
};

export const fetchAvailableEarningsYears = async (hostId) => {
  const { data } = await fetchFromAPI({
    endpoint: `/earnings/years`,
    config: { params: { hostId } },
  });
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

export const incrementViewCount = async ({ listingId }) => {
  return await SuitescapeAPI.post(`/listings/${listingId}/view`);
};

export const addListingSpecialRate = async ({
  listingId,
  title,
  price,
  startDate,
  endDate,
}) => {
  return await SuitescapeAPI.post(`/listings/${listingId}/add-special-rate`, {
    title,
    price,
    start_date: startDate,
    end_date: endDate,
  });
};

export const removeListingSpecialRate = async ({
  listingId,
  specialRateId,
}) => {
  return await SuitescapeAPI.post(
    `/listings/${listingId}/remove-special-rate`,
    { special_rate_id: specialRateId },
  );
};

export const blockListingDates = async ({ listingId, startDate, endDate }) => {
  return await SuitescapeAPI.post(`/listings/${listingId}/block-dates`, {
    start_date: startDate,
    end_date: endDate,
  });
};

export const unblockListingDates = async ({
  listingId,
  startDate,
  endDate,
}) => {
  return await SuitescapeAPI.post(`/listings/${listingId}/unblock-dates`, {
    start_date: startDate,
    end_date: endDate,
  });
};

export const updateListingPrices = async ({
  listingId,
  weekdayPrice,
  weekendPrice,
}) => {
  return await SuitescapeAPI.post(`/listings/${listingId}/update-prices`, {
    entire_place_weekday_price: weekdayPrice,
    entire_place_weekend_price: weekendPrice,
  });
};

export const addRoomSpecialRate = async ({
  roomId,
  title,
  price,
  startDate,
  endDate,
}) => {
  return await SuitescapeAPI.post(`/rooms/${roomId}/add-special-rate`, {
    title,
    price,
    start_date: startDate,
    end_date: endDate,
  });
};

export const removeRoomSpecialRate = async ({ roomId, specialRateId }) => {
  return await SuitescapeAPI.post(`/rooms/${roomId}/remove-special-rate`, {
    special_rate_id: specialRateId,
  });
};

export const blockRoomDates = async ({ roomId, startDate, endDate }) => {
  return await SuitescapeAPI.post(`/rooms/${roomId}/block-dates`, {
    start_date: startDate,
    end_date: endDate,
  });
};

export const unblockRoomDates = async ({ roomId, startDate, endDate }) => {
  return await SuitescapeAPI.post(`/rooms/${roomId}/unblock-dates`, {
    start_date: startDate,
    end_date: endDate,
  });
};

export const updateRoomPrices = async ({
  roomId,
  weekdayPrice,
  weekendPrice,
}) => {
  return await SuitescapeAPI.post(`/rooms/${roomId}/update-prices`, {
    weekday_price: weekdayPrice,
    weekend_price: weekendPrice,
  });
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

export const createListing = async ({ listingData, config = {} }) => {
  return await SuitescapeAPI.post("/listings", listingData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 300000,
    ...config,
  });
};

export const updateListing = async ({
  listingId,
  listingData,
  config = {},
}) => {
  return await SuitescapeAPI.post(`/listings/${listingId}`, listingData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 300000,
    ...config,
  });
};

export const deleteListing = async ({ listingId }) => {
  return await SuitescapeAPI.delete(`/listings/${listingId}`);
};

export const createReview = async ({
  listingId,
  feedback,
  overallRating,
  serviceRatings,
}) => {
  return await SuitescapeAPI.post(`/reviews`, {
    listing_id: listingId,
    feedback,
    overall_rating: overallRating,
    ...serviceRatings,
  });
};

export const updateProfile = async ({ profileData, config = {} }) => {
  return await SuitescapeAPI.post("/profile/update", profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 300000,
    ...config,
  });
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
