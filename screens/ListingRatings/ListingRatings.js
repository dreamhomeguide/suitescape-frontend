import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ListingRatingsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import StarRatingView from "../../components/StarRatingView/StarRatingView";
import useFetchAPI from "../../hooks/useFetchAPI";

const ListingRatings = ({ navigation, route }) => {
  const [showReviews, setShowReviews] = useState(false);

  const { listingId, averageRating, reviewsCount } = route.params;
  const { data: reviews } = useFetchAPI(`/listings/${listingId}/reviews`);
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }) => <ReviewItem item={item} />, []);

  useEffect(() => {
    return navigation.addListener("transitionEnd", () => {
      setShowReviews(true);
    });
  }, []);

  return (
    <View style={globalStyles.flexFull}>
      <View style={style.headerContainer}>
        <Text>All Reviews:</Text>
        <StarRatingView rating={averageRating} textStyle={style.ratingText} />
        <Text style={style.countText}>({reviewsCount} reviews)</Text>
      </View>

      <FlatList
        data={showReviews ? reviews : null}
        contentInset={{ bottom: insets.bottom }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <ActivityIndicator style={globalStyles.loadingCircle} />
        )}
      />
    </View>
  );
};

export default ListingRatings;
