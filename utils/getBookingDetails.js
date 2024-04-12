import { differenceInDays, format } from "date-fns";

import convertDateFormat from "./dateConverter";
import facilityData from "../data/facilityData";

const labels = {
  firstname: "First Name",
  lastname: "Last Name",
  gender: "Gender",
  email: "Email",
  address: "Address",
  region: "Region",
  city: "City",
  zipCode: "Zip/Postal Code",
  mobileNumber: "Phone Number",
};

export const getGuestDetails = (userData) => ({
  label: "Guest Details",
  data: userData
    ? Object.entries(userData)
        .filter(([key]) => labels[key]) // Only show the data that has an associated label
        .map(([key, value]) => ({ label: labels[key], value })) // Get the associated label and value
    : [],
});

export const getBookingDetails = ({ startDate, endDate, listing, room }) => ({
  label: "Booking Details",
  data: [
    {
      label: "Date",
      value:
        startDate &&
        endDate &&
        format(startDate, "MMM d") + " - " + format(endDate, "MMM d, yyyy"),
    },
    {
      label: "Check In",
      value: startDate && format(startDate, "MMM d, yyyy"),
    },
    {
      label: "Check-in time",
      value:
        listing?.check_in_time &&
        convertDateFormat(listing.check_in_time, "time"),
    },
    {
      label: "Check Out",
      value: endDate && format(endDate, "MMM d, yyyy"),
    },
    {
      label: "Check-out time",
      value:
        listing?.check_out_time &&
        convertDateFormat(listing.check_out_time, "time"),
    },
    {
      label: "Adult",
      value: listing?.adult_capacity,
    },
    {
      label: "Children",
      value: listing?.child_capacity,
    },
    {
      label: "Type of Facility",
      value: facilityData[listing?.facility_type],
    },
    {
      label: "Room Type",
      value: room?.category.name,
    },
    {
      label: "Number of Rooms",
      value: 2,
    },
    {
      label: "Pet Friendly",
      value: listing?.pet_friendly ? "Yes" : "No",
    },
    {
      label: "Parking Lot",
      value: listing?.parking_lot ? "Yes" : "No",
    },
  ],
});

export const getPaymentDetails = ({
  roomPrice,
  nights,
  discount,
  suitescapeFee,
}) => {
  const totalRoomPrice = roomPrice * nights;
  const totalDiscount = totalRoomPrice * discount;
  return {
    label: "Payment Details",
    amount: totalRoomPrice + suitescapeFee - totalDiscount,
    data: [
      {
        label: `₱${roomPrice?.toLocaleString()} x ${nights} night${nights > 1 ? "s" : ""}`,
        value: "₱" + totalRoomPrice?.toLocaleString(),
      },
      {
        label: "Suitescape Fee",
        value: "₱" + suitescapeFee,
      },
      {
        label: `Less ${discount * 100}% Off`,
        value: "₱-" + totalDiscount?.toLocaleString(),
      },
    ],
  };
};

export const getDateDetails = ({ startDate, endDate, listing }) => ({
  label: "Booking Dates",
  data: [
    {
      label: "Date",
      value:
        startDate &&
        endDate &&
        format(startDate, "MMM d") + " - " + format(endDate, "MMM d, yyyy"),
    },
    {
      label: "Check In",
      value: startDate && format(startDate, "MMM d, yyyy"),
    },
    {
      label: "Check-in time",
      value:
        listing?.check_in_time &&
        convertDateFormat(listing.check_in_time, "time"),
    },
    {
      label: "Check Out",
      value: endDate && format(endDate, "MMM d, yyyy"),
    },
    {
      label: "Check-out time",
      value:
        listing?.check_out_time &&
        convertDateFormat(listing.check_out_time, "time"),
    },
  ],
});

export const getPriceDetails = ({
  startDate,
  endDate,
  roomPrice,
  previousAmount,
  suitescapeFee,
}) => {
  const nights = differenceInDays(endDate, startDate) || 1;
  const newPrice = roomPrice * nights + suitescapeFee;

  return {
    label: "Price Update",
    amount: newPrice,
    data: [
      {
        label: "Original Price",
        value: `₱${previousAmount?.toLocaleString()}`,
      },
      {
        label: "New Price",
        value: `₱${newPrice?.toLocaleString()}`,
      },
      {
        label: "Amount paid",
        value: `₱-${previousAmount?.toLocaleString()}`,
      },
    ],
  };
};
