import React, { memo, useCallback } from "react";
import { Text, View } from "react-native";

import style from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ServiceRating from "../ServiceRating/ServiceRating";

const DetailsRatingsView = ({ serviceRating }) => {
  const renderServiceRatings = useCallback(() => {
    // Filter out empty ratings and map the rest to ServiceRating components
    const serviceRatings = serviceRating
      ? Object.entries(serviceRating)
          .filter(([_key, value]) => value)
          .map(([key, value], index) => (
            <ServiceRating key={index} label={key} rating={value} />
          ))
      : [];

    return serviceRatings.length > 0 ? (
      serviceRatings
    ) : (
      <Text style={style.text}>No service ratings yet.</Text>
    );
  }, [serviceRating]);

  return (
    <View style={style.container}>
      <Text style={style.headerText}>Service Rating</Text>
      <View
        style={{
          ...style.serviceRatingContainer,
          ...globalStyles.containerGap,
        }}
      >
        {renderServiceRatings()}
      </View>
    </View>
  );
};

export default memo(DetailsRatingsView);
