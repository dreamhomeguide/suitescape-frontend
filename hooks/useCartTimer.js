import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef } from "react";
import { useToast } from "react-native-toast-notifications";

import toastStyles from "../assets/styles/toastStyles";
import { useCartContext } from "../contexts/CartContext";
import { useTimerContext } from "../contexts/TimerContext";

const MAX_CART_DURATION = 900; // 15 minutes

const useCartTimer = () => {
  const {
    timerState: { timers },
    updateTimer,
    stopTimer,
  } = useTimerContext();
  const {
    cartState: { listings },
    archiveAll,
  } = useCartContext();
  const toast = useToast();

  const timerRefs = useRef({});

  useEffect(() => {
    // Clear timer if it's already running
    Object.values(timerRefs.current).forEach(clearInterval);

    // Get listingIds from timerState
    const listingIds = Object.keys(timers);

    listingIds.forEach((listingId) => {
      const listingTimer = timers[listingId];

      if (listingTimer?.timerStarted && !listingTimer?.timerPaused) {
        // Stop timer if cart is empty
        if (listings[listingId].cart.length === 0) {
          stopTimer(listingId);
          return;
        }

        // Stop timer if cart is expired
        if (listingTimer.timer >= MAX_CART_DURATION) {
          archiveAll({ listingId });
          stopTimer(listingId);
          toast.show("Cart expired", {
            type: "danger",
            placement: "top",
            style: toastStyles.toastInsetHeader,
            icon: <Ionicons name="cart" size={20} color="white" />,
          });
          return;
        }

        // Update timer every second
        timerRefs.current[listingId] = setInterval(() => {
          console.log("Timer running for", listingId, listingTimer.timer);
          updateTimer(listingId, listingTimer.timer + 1);
        }, 1000);
      }
    });
  }, [listings, timers]);

  useEffect(() => {
    return () => {
      // Clear timer if component unmounts
      console.log("Clearing/pausing timers...");
      Object.values(timerRefs.current).forEach(clearInterval);
    };
  }, []);
};

export default useCartTimer;
