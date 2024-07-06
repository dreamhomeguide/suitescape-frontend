import { useQuery } from "@tanstack/react-query";
import { format, set } from "date-fns";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import style from "./EarningsStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormPicker from "../../components/FormPicker/FormPicker";
import {
  fetchAvailableEarningsYears,
  fetchHostListings,
  fetchYearlyEarnings,
} from "../../services/apiService";

const NO_OF_SECTIONS = 5;

const Earnings = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedListing, setSelectedListing] = useState("");
  const [firstDataIndex, setFirstDataIndex] = useState(0);

  const { width } = useWindowDimensions();

  const { data: yearlyEarnings } = useQuery({
    queryKey: ["host", "earnings", selectedYear, selectedListing],
    queryFn: () =>
      fetchYearlyEarnings({ year: selectedYear, listingId: selectedListing }),
    select: (data) =>
      data?.monthly_earnings.map((monthlyEarning) => {
        const currentMonth = set(new Date(), {
          month: monthlyEarning.month - 1, // month is 0-indexed
        });

        return {
          label: format(currentMonth, "MMM"),
          value: parseFloat(monthlyEarning.earnings),
        };
      }),
    enabled: !!selectedYear,
  });

  const { data: listings, isFetching: isFetchingListings } = useQuery({
    queryKey: ["host", "listings"],
    queryFn: fetchHostListings,
    select: (data) => {
      const mappedData = data?.map((listing) => ({
        label: listing.name,
        value: listing.id,
      }));

      return [
        {
          label: "All Listings",
          value: "",
        },
        ...mappedData,
      ];
    },
  });

  const { data: availableYears, isFetching: isFetchingYears } = useQuery({
    queryKey: ["host", "earnings", "years"],
    queryFn: fetchAvailableEarningsYears,
    select: (data) =>
      data?.map((year) => ({
        label: year,
        value: year,
      })),
  });

  useEffect(() => {
    // Get the first index with data
    const firstIndex = yearlyEarnings?.findIndex((item) => item.value > 0);

    if (firstIndex !== -1) {
      setFirstDataIndex(firstIndex);
    }
  }, [yearlyEarnings]);

  useEffect(() => {
    if (availableYears?.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0].value);
    }
  }, [availableYears]);

  const renderTooltip = useCallback(
    (item) => (
      <BlurView intensity={90} style={style.tooltipContainer}>
        <Text>₱{item.value}</Text>
      </BlurView>
    ),
    [],
  );

  return (
    <ScrollView bounces={false} contentContainerStyle={style.mainContainer}>
      <Text style={globalStyles.headerText}>Yearly Report</Text>

      <FormPicker
        label="Selected Year"
        placeholder="Select Year"
        data={availableYears}
        value={selectedYear}
        onSelected={(value) => {
          if (value !== null) {
            setSelectedYear(value);
          }
        }}
      />

      <FormPicker
        label="Selected Listing"
        placeholder="Select Listing"
        data={listings}
        value={selectedListing}
        onSelected={(value) => {
          if (value !== null) {
            setSelectedListing(value);
          }
        }}
      />

      <View style={style.chartContainer}>
        <BarChart
          isAnimated
          scrollToIndex={firstDataIndex}
          data={yearlyEarnings}
          // initialSpacing={0}
          // adjustToWidth
          height={width * 0.8}
          width={width * 0.75}
          leftShiftForTooltip={5}
          overflowTop={35}
          spacing={30}
          // formatYLabel={(value) => {
          //   return `₱${value}`;
          // }}
          yAxisLabelPrefix="₱"
          yAxisLabelWidth={width * 0.15}
          barBorderRadius={5}
          frontColor={Colors.blue}
          noOfSections={NO_OF_SECTIONS}
          rulesType="solid"
          renderTooltip={renderTooltip}
          // yAxisThickness={0}
          // xAxisThickness={0}
          // hideRules
        />
      </View>

      <DialogLoading visible={isFetchingListings || isFetchingYears} />
    </ScrollView>
  );
};

export default Earnings;
