import { format } from "date-fns";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, View } from "react-native";

import style from "./BookingSummaryStyles";
import detailsStyles from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import StarRatingView from "../../components/StarRatingView/StarRatingView";
import { useBookingContext } from "../../contexts/BookingContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import capitalizedText from "../../utilities/textCapitalizer";

const ADDITIONAL_SERVICE_FEE = 600;
const SUITESCAPE_FEE = 100;

const BookingSummary = ({ navigation }) => {
  const { listing } = useListingContext();
  const { room } = useRoomContext();
  const { bookingState, setBookingData } = useBookingContext();

  const startDate = new Date(bookingState.startDate);
  const endDate = new Date(bookingState.endDate);
  const roomPrice = room.category.price * (bookingState.nights || 1);
  const total = roomPrice + ADDITIONAL_SERVICE_FEE + SUITESCAPE_FEE;

  const handleConfirmButton = () => {
    setBookingData({ amount: total });

    navigation.navigate(Routes.PAYMENT_METHOD);
  };

  const bookingDetails = {
    label: "Booking Details",
    data: [
      {
        label: "Date",
        value:
          format(startDate, "MMM d") + " - " + format(endDate, "MMM d, yyyy"),
      },
      {
        label: "Check In",
        value: format(startDate, "MMM d, yyyy"),
      },
      {
        label: "Check Out",
        value: format(endDate, "MMM d, yyyy"),
      },
      {
        label: "Pax",
        value: 3,
      },
      {
        label: "Adult",
        value: 1,
      },
      {
        label: "Children",
        value: 2,
      },
      {
        label: "Room Type",
        value: room.category.name,
      },
      {
        label: "Type of Beds",
        value: Object.keys(room.category.type_of_beds)
          .map((bedType) => capitalizedText(bedType))
          .join(", "),
      },
    ],
  };

  const guestDetails = {
    label: "Guest Details",
    data: [
      {
        label: "First Name",
        value: bookingState.firstName,
      },
      {
        label: "Last Name",
        value: bookingState.lastName,
      },
      {
        label: "Gender",
        value: bookingState.gender,
      },
      {
        label: "Email",
        value: bookingState.email,
      },
      {
        label: "Address",
        value: bookingState.address,
      },
      {
        label: "Zip/Postal Code",
        value: bookingState.zipCode,
      },
      {
        label: "City",
        value: bookingState.city,
      },
      {
        label: "Region",
        value: bookingState.region,
      },
      {
        label: "Phone Number",
        value: bookingState.mobileNumber,
      },
    ],
  };

  const paymentDetails = {
    label: "Payment Details",
    data: [
      {
        label: `₱${room.category.price} x ${bookingState.nights || 1} night(s)`,
        value: "₱" + roomPrice.toLocaleString(),
      },
      {
        label: "Additional Services",
        value: "₱" + ADDITIONAL_SERVICE_FEE,
      },
      {
        label: "Suitescape Fee",
        value: "₱" + SUITESCAPE_FEE,
      },
    ],
  };

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView>
        <View style={style.container}>
          <View style={style.titleContainer}>
            <Image
              source={{ uri: baseURL + listing.images[0].url }}
              style={style.image}
            />
            <View style={style.titleContentContainer}>
              <Text style={style.largeHeaderText}>{listing.name}</Text>
              <Text>{listing.location}</Text>
              <StarRatingView rating={listing.average_rating} />
            </View>
          </View>
        </View>

        <View style={{ ...style.container, ...globalStyles.largeContainerGap }}>
          {listing.booking_policies.length > 0 && (
            <View>
              <Text style={style.headerText}>Booking Policy</Text>
              <View style={globalStyles.textGap}>
                <>
                  {listing.booking_policies.map((policy, index) => (
                    <Text key={index} style={detailsStyles.emphasizedText}>
                      {policy.name}
                    </Text>
                  ))}
                </>
              </View>
            </View>
          )}

          {listing.cancellation_policy && (
            <View>
              <Text style={style.headerText}>Cancellation Policy</Text>

              <Text style={detailsStyles.emphasizedText}>
                {listing.cancellation_policy}
              </Text>
            </View>
          )}
        </View>

        <View style={style.container}>
          <Text style={style.headerText}>{bookingDetails.label}</Text>
          <View style={globalStyles.largeContainerGap}>
            <>
              {bookingDetails.data.map((detail, index) => (
                <View key={index} style={style.detailsRow}>
                  <Text style={style.detailsLabel}>{detail.label}</Text>
                  <Text style={style.detailsValue}>{detail.value}</Text>
                </View>
              ))}
            </>
          </View>
        </View>

        <View style={style.container}>
          <Text style={style.headerText}>{guestDetails.label}</Text>
          <View style={globalStyles.largeContainerGap}>
            <>
              {guestDetails.data.map((detail, index) => (
                <View key={index} style={style.detailsRow}>
                  <Text style={style.detailsLabel}>{detail.label}</Text>
                  <Text style={style.detailsValue}>{detail.value}</Text>
                </View>
              ))}
            </>
          </View>
        </View>

        {bookingState.message?.trim() && (
          <View style={style.container}>
            <View style={globalStyles.largeContainerGap}>
              <Text style={style.detailsLabel}>Message (Optional)</Text>
              <Text style={{ ...style.detailsValue, ...style.message }}>
                {bookingState.message}
              </Text>
            </View>
          </View>
        )}

        <View style={style.container}>
          <Text style={style.headerText}>{paymentDetails.label}</Text>
          <View style={globalStyles.largeContainerGap}>
            <>
              {paymentDetails.data.map((detail, index) => (
                <View key={index} style={style.detailsRow}>
                  <Text style={style.detailsLabel}>{detail.label}</Text>
                  <Text style={style.detailsValue}>{detail.value}</Text>
                </View>
              ))}
            </>
          </View>
        </View>
        <View style={style.container}>
          <View style={style.detailsRow}>
            <Text style={style.largeHeaderText}>Total</Text>
            <Text style={style.largeHeaderText}>
              {"₱" + total.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
      <AppFooter>
        <ButtonLarge onPress={handleConfirmButton}>Confirm</ButtonLarge>
      </AppFooter>
    </View>
  );
};

export default BookingSummary;
