import { Slider } from "@miblanchard/react-native-slider";
import React, { memo, useMemo, useState } from "react";
import { View } from "react-native";

import style from "./PriceRangeStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import extractNumber from "../../utilities/numberExtractor";
import DashView from "../DashView/DashView";
import FormInput from "../FormInput/FormInput";

const MINIMUM_PRICE = 0;
const MAXIMUM_PRICE = 5_000;
const STEP = 50;
const RESET_VALUE = -1;

const PriceRange = ({ onPriceRangeChanged, onScrollChange, scrollViewRef }) => {
  const [minimumPrice, setMinimumPrice] = useState(RESET_VALUE);
  const [maximumPrice, setMaximumPrice] = useState(RESET_VALUE);
  const [previousPriceRange, setPreviousPriceRange] = useState([
    MINIMUM_PRICE,
    MAXIMUM_PRICE,
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const priceRange = useMemo(() => {
    const minPrice =
      minimumPrice === RESET_VALUE ? MINIMUM_PRICE : minimumPrice;
    const maxPrice =
      maximumPrice === RESET_VALUE ? MAXIMUM_PRICE : maximumPrice;

    if (!isTyping) {
      setPreviousPriceRange([minPrice, maxPrice]);
    }

    return [minPrice, maxPrice];
  }, [isTyping, minimumPrice, maximumPrice]);

  return (
    <>
      <Slider
        animateTransitions
        onSlidingStart={() => {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
          onScrollChange(false);
        }}
        onSlidingComplete={() => {
          onScrollChange(true);
          onPriceRangeChanged(priceRange);
        }}
        thumbStyle={style.thumb}
        minimumTrackStyle={{ backgroundColor: Colors.blue }}
        maximumTrackStyle={{ backgroundColor: Colors.lightgray }}
        minimumValue={MINIMUM_PRICE}
        maximumValue={MAXIMUM_PRICE}
        step={STEP}
        value={isTyping ? previousPriceRange : priceRange}
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
          setMinimumPrice(minimum);
          setMaximumPrice(maximum);
        }}
      />
      <View style={style.inputContainer}>
        <FormInput
          value={minimumPrice === RESET_VALUE ? "" : minimumPrice?.toString()}
          placeholder="Min Price"
          keyboardType="number-pad"
          onChangeText={(value) => {
            extractNumber(value, (numberValue) => {
              setMinimumPrice(numberValue);
            });
          }}
          disableAnimations
          useDefaultStyles={false}
          onFocus={() => setIsTyping(true)}
          onBlur={() => {
            setIsTyping(false);

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

              setMaximumPrice(RESET_VALUE);
            }

            // Normalize the minimum price
            if (minimumPrice > MAXIMUM_PRICE) {
              setMinimumPrice(MAXIMUM_PRICE);
            }
          }}
          containerStyle={globalStyles.flexFull}
        />
        <DashView />

        <FormInput
          value={maximumPrice === RESET_VALUE ? "" : maximumPrice?.toString()}
          placeholder="Max Price"
          keyboardType="number-pad"
          onChangeText={(value) => {
            extractNumber(value, (numberValue) => {
              if (!numberValue) {
                setMaximumPrice(RESET_VALUE);
              } else {
                setMaximumPrice(numberValue);
              }
            });
          }}
          disableAnimations
          useDefaultStyles={false}
          onFocus={() => setIsTyping(true)}
          onBlur={() => {
            setIsTyping(false);

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

              setMinimumPrice(RESET_VALUE);
            }

            // Set maximum price to maximum if it is greater than maximum
            if (maximumPrice > MAXIMUM_PRICE) {
              setMaximumPrice(MAXIMUM_PRICE);
            }
          }}
          containerStyle={globalStyles.flexFull}
        />
      </View>
    </>
  );
};

export default memo(PriceRange);
