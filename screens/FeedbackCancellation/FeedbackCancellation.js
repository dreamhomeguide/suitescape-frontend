import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Checkbox } from "react-native-ui-lib";

import { Colors } from "../../assets/Colors";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import FormInput from "../../components/FormInput/FormInput";
import { useListingContext } from "../../contexts/ListingContext";
import { Routes } from "../../navigation/Routes";
import { updateBookingStatus } from "../../services/apiService";
import { handleApiError } from "../../utils/apiHelpers";

const otherOption = "Other (please specify):";

const feedbackOptions = [
  "Change in plans.",
  "Found an alternative with better amenities.",
  "Dissatisfaction with pricing.",
  "Disappointment with available dates.",
  "Unexpected work commitments.",
  "Dissatisfaction with location.",
  "Health or medical reasons.",
  "Discovered a more suitable accommodation.",
  otherOption,
];

const FeedbackCancellation = ({ navigation, route }) => {
  const bookingId = route.params.bookingId;

  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");

  const scrollViewRef = useRef(null);
  const messageInputRef = useRef(null);

  const { listing } = useListingContext();
  const queryClient = useQueryClient();

  const cancelBookingMutation = useMutation({
    mutationFn: ({ bookingId }) =>
      updateBookingStatus({ bookingId, status: "cancelled" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["bookings", "user"],
        exact: true,
      });

      await queryClient.invalidateQueries({
        queryKey: ["bookings", bookingId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["listings", listing.id],
      });

      navigation.navigate(Routes.FEEDBACK, {
        type: "success",
        title: "Congratulations",
        subtitle: "Booking Cancelled Successfully",
        screenToNavigate: {
          name: Routes.BOOKINGS,
          params: { tab: "Cancelled" },
        },
      });
    },
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const handleCancelBooking = useCallback(() => {
    if (selected === "") {
      Alert.alert("Please select a reason for cancelling.");
      return;
    }

    if (selected === otherOption && message.trim() === "") {
      Alert.alert("Please specify the reason for cancelling.");
      return;
    }

    if (!cancelBookingMutation.isPending) {
      cancelBookingMutation.mutate({ bookingId });
    }
  }, [bookingId, cancelBookingMutation.isPending, message, selected]);

  const onItemPress = useCallback(
    (item) => {
      if (selected === item) {
        setSelected("");
        return;
      }
      setSelected(item);
    },
    [selected],
  );

  // Scroll to the end when the message input is focused
  const onFocusMessageInput = useCallback(() => {
    setTimeout(() => scrollViewRef.current.scrollToEnd(), 300);
    setSelected(otherOption);
  }, []);

  // Focus on the message input when "Other" is selected
  useEffect(() => {
    if (selected === otherOption) {
      messageInputRef.current.focus();
    } else {
      messageInputRef.current.blur();
    }
  }, [selected]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ padding: 10 }}>
        <Pressable
          style={({ pressed }) => pressedOpacity(pressed)}
          onPress={() => onItemPress(item)}
        >
          <View pointerEvents="none">
            <Checkbox
              label={item}
              color={Colors.blue}
              value={selected === item}
            />
          </View>
        </Pressable>
      </View>
    ),
    [onItemPress, selected],
  );

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={globalStyles.rowGapSmall}
      >
        <View style={style.container}>
          <Text style={style.headerText}>
            Please specify the reason for cancelling
          </Text>
          <Text>
            Please state the reason for canceling the booking, as it is required
            for the cancellation to be completed.
          </Text>
        </View>

        <View style={style.container}>
          <FlatList
            data={feedbackOptions}
            scrollEnabled={false}
            renderItem={renderItem}
          />

          <View style={{ padding: 10, marginTop: 10 }}>
            <Text style={globalStyles.semiBoldText}>
              Please specify the reason for cancelling:
            </Text>
          </View>

          <FormInput
            ref={messageInputRef}
            type="textarea"
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            containerStyle={{ padding: 5 }}
            onFocus={onFocusMessageInput}
            // readOnly={selected !== otherOption}
            color={selected !== otherOption ? Colors.gray : undefined}
          />
        </View>
      </ScrollView>

      <AppFooter>
        <ButtonLarge onPress={handleCancelBooking} color={Colors.lightred}>
          Cancel Booking
        </ButtonLarge>
      </AppFooter>
    </View>
  );
};

export default FeedbackCancellation;
