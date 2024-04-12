import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ServiceRating from "../ServiceRating/ServiceRating";

const DetailsRatingsView = ({ serviceRating }) => {
  return (
    <View style={style.container}>
      <Text style={style.headerText}>Service Rating</Text>
      <View
        style={{
          ...style.serviceRatingContainer,
          ...globalStyles.containerGap,
        }}
      >
        <>
          {serviceRating ? (
            Object.entries(serviceRating).map(([key, value], index) => (
              <ServiceRating key={index} label={key} rating={value} />
            ))
          ) : (
            <Text style={style.text}>No service rating yet.</Text>
          )}
        </>
      </View>
    </View>
  );
};

export default memo(DetailsRatingsView);
