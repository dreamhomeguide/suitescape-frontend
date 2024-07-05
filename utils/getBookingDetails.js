import { differenceInDays, format } from "date-fns";

import facilityData from "../data/facilityData";

const labels = {
  firstname: "First Name",
  lastname: "Last Name",
  email: "Email",
  address: "Address",
  region: "Region",
  city: "City",
  zipcode: "Zip/Postal Code",
  mobile_number: "Phone Number",
};

export const getGuestDetails = (userData) => ({
  label: "Guest Details",
  data: userData
    ? Object.entries(userData)
        .filter(([key]) => labels[key]) // Only show the data that has an associated label
        .map(([key, value]) => ({ label: labels[key], value })) // Get the associated label and value
    : [],
});

export const getBookingDetails = ({ startDate, endDate, listing }) => ({
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
      value: listing?.check_in_time,
      // convertDateFormat(listing.check_in_time, "time"),
    },
    {
      label: "Check Out",
      value: endDate && format(endDate, "MMM d, yyyy"),
    },
    {
      label: "Check-out time",
      value: listing?.check_out_time,
      // convertDateFormat(listing.check_out_time, "time"),
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
    // {
    //   label: "Room Type",
    //   value: room?.category.name,
    // },
    // {
    //   label: "Number of Rooms",
    //   value: 2,
    // },
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

export const getRoomDetails = (roomsData) => {
  return {
    label: "Room Details",
    data: roomsData?.map((room) => ({
      label: `${room.quantity} ${room.name}`,
      value: "₱" + (room.price * room.quantity).toLocaleString(),
    })),
  };
};

export const getAddOnDetails = (addonsData) => {
  return {
    label: "Add-ons",
    data: addonsData?.map((addon) => ({
      label: `${addon.quantity} ${addon.name}`,
      value: "₱" + (addon.price * addon.quantity).toLocaleString(),
    })),
  };
};

export const getPaymentDetails = ({
  totalPrice,
  nights,
  discount,
  suitescapeFee,
  isEntirePlace,
}) => {
  const grandTotal = totalPrice * nights;
  const totalDiscount = grandTotal * discount;
  const amountToPay = grandTotal + suitescapeFee - totalDiscount;

  const data = [
    {
      label: `Subtotal ${isEntirePlace ? "(Entire Place Price + Addons)" : "(Rooms + Addons)"}`,
      value: "₱" + totalPrice?.toLocaleString(),
    },
    {
      label: `Total (₱${totalPrice?.toLocaleString()} x ${nights} ${nights === 1 ? "night" : "nights"})`,
      value: "₱" + grandTotal?.toLocaleString(),
    },
    {
      label: "Suitescape Fee",
      value: "₱" + suitescapeFee,
    },
  ];

  if (discount > 0) {
    data.push({
      label: `Less ${discount * 100}% Off`,
      value: "₱-" + totalDiscount?.toLocaleString(),
    });
  }

  return {
    label: "Payment Details",
    amount: amountToPay.toLocaleString(),
    data,
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
      value: listing?.check_in_time,
      // convertDateFormat(listing.check_in_time, "time"),
    },
    {
      label: "Check Out",
      value: endDate && format(endDate, "MMM d, yyyy"),
    },
    {
      label: "Check-out time",
      value: listing?.check_out_time,
      // convertDateFormat(listing.check_out_time, "time"),
    },
  ],
});

export const getPriceDetails = ({
  startDate,
  endDate,
  prevAmount,
  suitescapeFee,
}) => {
  const nights = differenceInDays(endDate, startDate) || 1;
  const newPrice = prevAmount * nights + suitescapeFee;

  return {
    label: "Price Update",
    amount: newPrice,
    data: [
      {
        label: "Original Price",
        value: `₱${prevAmount?.toLocaleString()}`,
      },
      {
        label: "New Price",
        value: `₱${newPrice?.toLocaleString()}`,
      },
      {
        label: "Amount paid",
        value: `₱-${prevAmount?.toLocaleString()}`,
      },
    ],
  };
};

export const getOriginalPrice = ({
  grandTotal,
  nights,
  discountRate,
  suitescapeFee,
}) => {
  // 100% discount means free
  if (discountRate === 1) {
    return 0;
  }

  const withoutFee = grandTotal - suitescapeFee;
  const withoutDiscount = 1 - discountRate;

  // Calculates the total before discount and suitescape fee
  const total = withoutFee / withoutDiscount / nights;
  return Math.round((total + Number.EPSILON) * 100) / 100;
};
