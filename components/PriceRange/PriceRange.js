import { Slider } from "@miblanchard/react-native-slider";
import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { useToast } from "react-native-toast-notifications";

import style from "./PriceRangeStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import extractNumber from "../../utilities/numberExtractor";
import DashView from "../DashView/DashView";
import FormInput from "../FormInput/FormInput";

const MINIMUM_PRICE = 0;
const MAXIMUM_PRICE = 5_000;
const STEP = 50;
const RESET_VALUE = -1;

const PriceRange = ({
  minimumPrice = RESET_VALUE,
  maximumPrice = RESET_VALUE,
  onMinPriceChanged,
  onMaxPriceChanged,
  disabled,
}) => {
  // const [previousPriceRange, setPreviousPriceRange] = useState([
  //   MINIMUM_PRICE,
  //   MAXIMUM_PRICE,
  // ]);
  // const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  const priceRange = useMemo(() => {
    const minPrice =
      minimumPrice === RESET_VALUE ? MINIMUM_PRICE : minimumPrice;
    const maxPrice =
      maximumPrice === RESET_VALUE ? MAXIMUM_PRICE : maximumPrice;

    // if (!isTyping) {
    //   setPreviousPriceRange([minPrice, maxPrice]);
    // }

    return [minPrice, maxPrice];
  }, [minimumPrice, maximumPrice]);

  return (
    <>
      <Slider
        animateTransitions
        disabled={disabled}
        thumbStyle={style.thumb}
        minimumTrackStyle={{ backgroundColor: Colors.blue }}
        maximumTrackStyle={{ backgroundColor: Colors.lightgray }}
        minimumValue={MINIMUM_PRICE}
        maximumValue={MAXIMUM_PRICE}
        step={STEP}
        // value={isTyping ? previousPriceRange : priceRange}
        value={priceRange}
        onValueChange={([minimum, maximum]) => {
          const gap = maximum - minimum;
          const minimumGap = STEP * 5;
          if (gap < minimumGap) {
            if (minimumPrice === minimum) {
              maximum = minimum + minimumGap;
            } else {
              minimum = maximum - minimumGap;
            }
          }
          onMinPriceChanged && onMinPriceChanged(minimum);
          onMaxPriceChanged && onMaxPriceChanged(maximum);
        }}
      />
      <View style={style.inputContainer}>
        <FormInput
          value={
            minimumPrice === RESET_VALUE ? "" : "₱" + minimumPrice?.toString()
          }
          placeholder="Min Price"
          keyboardType="number-pad"
          onChangeText={(value) => {
            extractNumber(value.replace("₱", ""), (numberValue) => {
              if (!numberValue && numberValue !== 0) {
                onMinPriceChanged && onMinPriceChanged(RESET_VALUE);
              } else {
                onMinPriceChanged && onMinPriceChanged(numberValue);
              }
            });
          }}
          disableAnimations
          useDefaultStyles={false}
          // onFocus={() => setIsTyping(true)}
          onBlur={() => {
            // setIsTyping(false);

            // if (minimumPrice === 0) {
            //   setMinimumPrice(RESET_VALUE);
            // }

            if (minimumPrice === RESET_VALUE) {
              return;
            }

            if (minimumPrice > maximumPrice && maximumPrice !== RESET_VALUE) {
              // Swap if minimum price is greater than maximum price
              // let temp = minimumPrice;
              // if (minimumPrice > MAXIMUM_PRICE) {
              //   temp = MAXIMUM_PRICE;
              // }
              // setMinimumPrice(maximumPrice);
              // setMaximumPrice(temp);

              toast.show("Min price cannot be greater than max price", {
                placement: "top",
                style: toastStyles.toastInsetHeader,
              });
              onMaxPriceChanged && onMaxPriceChanged(RESET_VALUE);
            }

            // Normalize the minimum price
            if (minimumPrice > MAXIMUM_PRICE) {
              toast.show(`Min price cannot be greater than ₱${MAXIMUM_PRICE}`, {
                placement: "top",
                style: toastStyles.toastInsetHeader,
              });
              onMinPriceChanged && onMinPriceChanged(MAXIMUM_PRICE);
            }
          }}
          containerStyle={globalStyles.flexFull}
        />
        <DashView />

        <FormInput
          value={
            maximumPrice === RESET_VALUE ? "" : "₱" + maximumPrice?.toString()
          }
          placeholder="Max Price"
          keyboardType="number-pad"
          onChangeText={(value) => {
            extractNumber(value.replace("₱", ""), (numberValue) => {
              if (!numberValue) {
                onMaxPriceChanged && onMaxPriceChanged(RESET_VALUE);
              } else {
                onMaxPriceChanged && onMaxPriceChanged(numberValue);
              }
            });
          }}
          disableAnimations
          useDefaultStyles={false}
          // onFocus={() => setIsTyping(true)}
          onBlur={() => {
            // setIsTyping(false);

            // if (maximumPrice === 0) {
            //   setMaximumPrice(RESET_VALUE);
            // }

            if (maximumPrice === RESET_VALUE) {
              return;
            }

            if (maximumPrice < minimumPrice && minimumPrice !== RESET_VALUE) {
              // Swap if maximum price is less than minimum price
              // const temp = maximumPrice;
              // setMaximumPrice(minimumPrice);
              // setMinimumPrice(temp);

              toast.show("Max price cannot be less than min price", {
                placement: "top",
                style: toastStyles.toastInsetHeader,
              });
              onMinPriceChanged && onMinPriceChanged(RESET_VALUE);
            }

            // Set maximum price to maximum if it is greater than maximum
            if (maximumPrice > MAXIMUM_PRICE) {
              toast.show(`Max price cannot be greater than ₱${MAXIMUM_PRICE}`, {
                placement: "top",
                style: toastStyles.toastInsetHeader,
              });
              onMaxPriceChanged && onMaxPriceChanged(MAXIMUM_PRICE);
            }
          }}
          containerStyle={globalStyles.flexFull}
        />
      </View>
    </>
  );
};

export default memo(PriceRange);
