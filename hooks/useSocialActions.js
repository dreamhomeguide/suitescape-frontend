import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToast } from "react-native-toast-notifications";

import toastStyles from "../assets/styles/toastStyles";
import { fetchListing, likeListing, saveListing } from "../services/apiService";
import { handleApiError, handleApiResponse } from "../utils/apiHelpers";

const useSocialActions = (listingId, useCache) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: listing } = useQuery({
    queryKey: ["listings", listingId, "social"], // Uses the data from VideoFeedItem if cached
    queryFn: () => fetchListing(listingId),
    initialData: useCache ? {} : undefined,
    enabled: !!listingId,
  });

  const {
    host: { id: hostId } = {},
    likes_count: likesCount,
    is_liked: isLiked,
    is_saved: isSaved,
  } = listing || {};

  const handleSuccessLike = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onSuccess: async ({ liked }) => {
          // dispatch({
          //   type: "SET_LIKE",
          //   payload: liked,
          // });
          // dispatch({
          //   type: "UPDATE_LIKES_COUNT",
          //   payload: liked ? state.likesCount + 1 : state.likesCount - 1,
          // });

          await queryClient.invalidateQueries({
            queryKey: ["listings", listingId, "social"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["profile", "liked"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["hosts", hostId],
          });

          if (liked) {
            console.log("Liked", listingId);
          }
        },
      }),
    [hostId, listingId, queryClient],
  );

  const handleSuccessSave = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onSuccess: async ({ saved }) => {
          // dispatch({
          //   type: "SET_SAVE",
          //   payload: saved,
          // });

          await queryClient.invalidateQueries({
            queryKey: ["listings", listingId, "social"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["profile", "saved"],
          });

          if (saved) {
            toast.show("Added to saved videos", {
              placement: "top",
              style: toastStyles.toastInsetTop,
            });
          }
        },
      }),
    [listingId, queryClient, toast],
  );

  const handleErrors = useCallback(
    (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
    [],
  );

  const likeMutation = useMutation({
    mutationFn: likeListing,
    onSuccess: handleSuccessLike,
    onError: handleErrors,
  });

  const saveMutation = useMutation({
    mutationFn: saveListing,
    onSuccess: handleSuccessSave,
    onError: handleErrors,
  });

  const handleLike = useCallback(() => {
    if (!likeMutation.isPending && listingId) {
      likeMutation.mutate({ listingId });
    }
  }, [likeMutation.isPending, listingId]);

  const handleSave = useCallback(() => {
    if (!saveMutation.isPending && listingId) {
      saveMutation.mutate({ listingId });
    }
  }, [saveMutation.isPending, listingId]);

  return { likesCount, isLiked, isSaved, handleLike, handleSave };
};

export default useSocialActions;
