import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { ActivityIndicator, Alert, FlatList, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import ProfileListingItem from "../../components/ProfileListingItem/ProfileListingItem";
import { fetchLikedListings, likeListing } from "../../services/apiService";

const Liked = () => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: liked, isFetched } = useQuery({
    queryKey: ["profile", "liked"],
    queryFn: fetchLikedListings,
  });

  const unlikeMutation = useMutation({
    mutationFn: likeListing,
    onSuccess: async (_, { listingId }) => {
      toast.show("Listing removed from liked listings.", {
        style: toastStyles.toastInsetBottom,
        duration: 800,
      });

      await queryClient.invalidateQueries({
        queryKey: ["listings", listingId, "social"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["profile", "liked"],
      });
    },
  });

  const handleRemove = useCallback(
    (listingId) => {
      Alert.alert(
        "Remove listing",
        "Are you sure you want to remove this listing from your liked listings?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            onPress: () => {
              if (!unlikeMutation.isPending) {
                unlikeMutation.mutate({ listingId });
              }
            },
          },
        ],
      );
    },
    [unlikeMutation.isPending],
  );

  const renderItem = useCallback(
    ({ item }) => <ProfileListingItem item={item} onRemove={handleRemove} />,
    [handleRemove],
  );

  const EmptyListComponent = useCallback(() => {
    return isFetched && liked ? (
      <Text style={globalStyles.emptyTextCenter}>No liked listings.</Text>
    ) : (
      <ActivityIndicator style={globalStyles.loadingCircle} />
    );
  }, [isFetched, liked]);

  return (
    <FlatList
      data={liked}
      numColumns={2}
      contentInset={{ bottom: insets.bottom }}
      contentContainerStyle={globalStyles.uniformGap}
      columnWrapperStyle={globalStyles.uniformGap}
      renderItem={renderItem}
      ListEmptyComponent={EmptyListComponent}
    />
  );
};

export default Liked;
