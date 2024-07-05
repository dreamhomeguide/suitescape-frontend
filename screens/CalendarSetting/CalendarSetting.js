import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import style from "./CalendarSettingStyles";
import { Colors } from "../../assets/Colors";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import CalendarPriceSheet from "../../components/CalendarPriceSheet/CalendarPriceSheet";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import useCalendar from "../../hooks/useCalendar";

const CalendarSetting = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWeekdayPrice, setIsWeekdayPrice] = useState(true);

  const { calendarPrices, updatePricesMutation } = useCalendar();

  const onWeekdayPricePress = useCallback(() => {
    setIsModalVisible(true);
    setIsWeekdayPrice(true);
  }, []);

  const onWeekendPricePress = useCallback(() => {
    setIsModalVisible(true);
    setIsWeekdayPrice(false);
  }, []);

  const onModalClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const onApplyPrice = useCallback(
    (value) => {
      onModalClose();

      if (
        isWeekdayPrice
          ? value === calendarPrices?.weekdayPrice
          : value === calendarPrices?.weekendPrice
      ) {
        return;
      }

      if (!updatePricesMutation.isPending) {
        updatePricesMutation.mutate({
          [isWeekdayPrice ? "weekdayPrice" : "weekendPrice"]: value,
        });
      }
    },
    [isWeekdayPrice, onModalClose, updatePricesMutation.isPending],
  );

  return (
    <>
      <View style={globalStyles.flexFull}>
        <ScrollView contentContainerStyle={style.contentContainer}>
          <View>
            <Text style={globalStyles.smallHeaderText}>Price per night</Text>

            <Pressable
              onPress={onWeekdayPricePress}
              style={({ pressed }) => ({
                ...style.container,
                ...pressedOpacity(pressed),
              })}
            >
              <Text style={style.label}>
                ₱{calendarPrices?.weekdayPrice.toLocaleString()}
              </Text>

              <MaterialCommunityIcons
                name="pencil"
                size={15}
                color={Colors.black}
              />
            </Pressable>
          </View>

          <View>
            <Text style={globalStyles.smallHeaderText}>Weekend Rate</Text>

            <Pressable
              onPress={onWeekendPricePress}
              style={({ pressed }) => ({
                ...style.container,
                ...pressedOpacity(pressed),
              })}
            >
              <Text style={style.label}>
                ₱{calendarPrices?.weekendPrice.toLocaleString()}
              </Text>
              <MaterialCommunityIcons
                name="pencil"
                size={15}
                color={Colors.black}
              />
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <CalendarPriceSheet
        isVisible={isModalVisible}
        currentPrice={
          isWeekdayPrice
            ? calendarPrices?.weekdayPrice
            : calendarPrices?.weekendPrice
        }
        onApplyChanges={onApplyPrice}
        headerLabel={isWeekdayPrice ? "Price Per Night" : "Weekend Rate"}
        onClose={onModalClose}
      />

      <DialogLoading visible={updatePricesMutation.isPending} />
    </>
  );
};

export default CalendarSetting;
