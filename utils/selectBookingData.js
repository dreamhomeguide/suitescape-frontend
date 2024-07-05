import { differenceInDays } from "date-fns";

const selectBookingData = (data) => {
  if (!data) {
    return null;
  }

  // Destructure booking data
  const {
    listing,
    booking_rooms: bookingRooms,
    amount: amountString,
    cancellation_policy: cancellationPolicy,
    cancellation_fee: cancellationFee,
    suitescape_cancellation_fee: suitescapeCancellationFee,
    date_start,
    date_end,
    ...rest
  } = data;

  const {
    // Get the first image as cover image
    images: [coverImage],
    booking_policies: bookingPolicies,
  } = listing;

  const startDate = new Date(date_start);
  const endDate = new Date(date_end);
  const nights = differenceInDays(endDate, startDate) || 1;
  const amount = parseFloat(amountString);

  return {
    listing,
    bookingRooms,
    coverImage,
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
