import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useToast } from "react-native-toast-notifications";

import toastStyles from "../assets/styles/toastStyles";
import SuitescapeAPI from "../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../utilities/apiHelpers";

export const SocialActionsContext = createContext(undefined);

export const SocialActionsProvider = ({
  children,
  listingId,
  currentIsLiked,
  currentIsSaved,
  currentLikesCount,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    setIsLiked(currentIsLiked);
    setIsSaved(currentIsSaved);
    setLikesCount(currentLikesCount);
  }, [currentIsLiked, currentIsSaved, currentLikesCount]);

  const likeMutation = useMutation({
    mutationFn: () => SuitescapeAPI.post(`/listings/${listingId}/like`),
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: ({ liked }) => {
          setIsLiked(liked);
          setLikesCount((prevLikes) => (liked ? prevLikes + 1 : prevLikes - 1));

          // queryClient.invalidateQueries({ queryKey: ["videos"] });
          queryClient.invalidateQueries({
            queryKey: ["listings", listingId, "host"],
          });
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const saveMutation = useMutation({
    mutationFn: () => SuitescapeAPI.post(`/listings/${listingId}/save`),
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: ({ saved }) => {
          setIsSaved(saved);
          if (saved) {
            toast.show("Added to saved videos", {
              placement: "top",
              style: toastStyles.toastInsetTop,
            });
          }
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        handleErrors: (errors) => Alert.alert(errors.message),
      }),
  });

  const handleLike = () => {
    if (!likeMutation.isPending) {
      likeMutation.mutate();
    }
  };

  const handleSave = () => {
    if (!saveMutation.isPending) {
      saveMutation.mutate();
    }
  };

  return (
    <SocialActionsContext.Provider
      value={{
        isLiked,
        isSaved,
        likesCount,
        isPending: likeMutation.isPending || saveMutation.isPending,
        handleLike,
        handleSave,
      }}
    >
      {children}
    </SocialActionsContext.Provider>
  );
};

export const useSocialActions = () => {
  return useContext(SocialActionsContext);
};
