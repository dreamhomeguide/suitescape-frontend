import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { ActivityIndicator, Alert, FlatList, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import ProfileListingItem from "../../components/ProfileListingItem/ProfileListingItem";
import { fetchSavedListings, saveListing } from "../../services/apiService";

const Saved = () => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: saved, isFetched } = useQuery({
    queryKey: ["profile", "saved"],
    queryFn: fetchSavedListings,
  });

  const unsaveMutation = useMutation({
    mutationFn: saveListing,
    onSuccess: async (_, { listingId }) => {
      toast.show("Listing removed from saved listings.", {
        style: toastStyles.toastInsetBottom,
        duration: 800,
      });

      await queryClient.invalidateQueries({
        queryKey: ["listings", listingId, "social"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["profile", "saved"],
      });
    },
  });

  const handleRemove = useCallback(
    (listingId) => {
      Alert.alert(
        "Remove listing",
        "Are you sure you want to remove this listing from your saved listings?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            onPress: () => {
              if (!unsaveMutation.isPending) {
                unsaveMutation.mutate({ listingId });
              }
            },
          },
        ],
      );
    },
    [unsaveMutation.isPending],
  );

  const renderItem = useCallback(
    ({ item }) => <ProfileListingItem item={item} onRemove={handleRemove} />,
    [handleRemove],
  );

  const EmptyListComponent = useCallback(() => {
    return isFetched && saved ? (
      <Text style={globalStyles.emptyTextCenter}>No saved listings.</Text>
    ) : (
      <ActivityIndicator style={globalStyles.loadingCircle} />
    );
  }, [isFetched, saved]);

  return (
    <FlatList
      data={saved}
      numColumns={2}
      contentInset={{ bottom: insets.bottom }}
      contentContainerStyle={globalStyles.uniformGap}
      columnWrapperStyle={globalStyles.uniformGap}
      renderItem={renderItem}
      ListEmptyComponent={EmptyListComponent}
    />
  );
};

export default Saved;
