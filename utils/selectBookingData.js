import { differenceInDays } from "date-fns";

const selectBookingData = (data) => {
  if (!data) {
    return null;
  }

  console.log(data);

  // Destructure booking data
  const {
    booking_rooms: bookingRooms,
    amount: amountString,
    cancellation_policy: cancellationPolicy,
    cancellation_fee: cancellationFee,
    suitescape_cancellation_fee: suitescapeCancellationFee,
    ...rest
  } = data;

  const {
    room: {
      listing: {
        images: [coverImage], // Get the first image as cover image
        booking_policies: bookingPolicies,
        ...listing
      },
      ...room
    },
    date_start,
    date_end,
  } = bookingRooms[0] || {}; // Get the first room only

  const startDate = new Date(date_start);
  const endDate = new Date(date_end);
  const nights = differenceInDays(endDate, startDate) || 1;
  const amount = parseFloat(amountString);

  return {
    coverImage,
    listing,
    room,
    startDate,
    endDate,
    nights,
    amount,
    bookingPolicies,
    cancellationPolicy,
    cancellationFee,
    suitescapeCancellationFee,
    ...rest,
  };
};

export default selectBookingData;
