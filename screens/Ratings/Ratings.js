import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./RatingsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import StarRatingView from "../../components/StarRatingView/StarRatingView";
import { fetchListingReviews } from "../../services/apiService";

const Ratings = ({ navigation, route }) => {
  const [showReviews, setShowReviews] = useState(false);

  const { id, averageRating, reviewsCount } = route.params;

  const insets = useSafeAreaInsets();

  const { data: reviews, isFetching } = useQuery({
    placeholderData: [],
    queryKey: ["listings", id, "reviews"],
    queryFn: () => fetchListingReviews(id),
    enabled: showReviews,
  });

  useEffect(() => {
    return navigation.addListener("transitionEnd", () => {
      setShowReviews(true);
    });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => <ReviewItem item={item} />, []);

  return (
    <View style={globalStyles.flexFull}>
      <View style={style.headerContainer}>
        <Text>All Reviews:</Text>
        <StarRatingView rating={averageRating} textStyle={style.ratingText} />
        <Text style={style.countText}>({reviewsCount} reviews)</Text>
      </View>

      <FlatList
        data={reviews}
        contentInset={{ bottom: insets.bottom }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        initialNumToRender={5}
        windowSize={5}
        maxToRenderPerBatch={3}
        updateCellsBatchingPeriod={100}
        removeClippedSubviews
        ListEmptyComponent={() =>
          isFetching && <ActivityIndicator style={globalStyles.loadingCircle} />
        }
      />
    </View>
  );
};

export default Ratings;
