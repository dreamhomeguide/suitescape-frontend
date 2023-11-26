import { useMutation } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useToast } from "react-native-toast-notifications";

import globalStyles from "../assets/styles/globalStyles";
import toastStyles from "../assets/styles/toastStyles";
import SuitescapeAPI from "../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../utilities/apiHelpers";

export const SocialActionsContext = createContext(undefined);

export const SocialActionsProvider = ({ children, listingData }) => {
  const { id: listingId, is_liked, is_saved, likes_count } = listingData;

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const toast = useToast();

  useEffect(() => {
    setIsLiked(is_liked);
    setIsSaved(is_saved);
    setLikesCount(likes_count);
  }, [listingData]);

  const likeMutation = useMutation({
    mutationFn: () => SuitescapeAPI.post(`/listings/${listingId}/like`),
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: ({ liked }) => {
          setIsLiked(liked);
          setLikesCount((prevLikes) => (liked ? prevLikes + 1 : prevLikes - 1));
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
    likeMutation.mutate();
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  return (
    <SocialActionsContext.Provider
      value={{ isLiked, isSaved, likesCount, handleLike, handleSave }}
    >
      {children}
    </SocialActionsContext.Provider>
  );
};

export const useSocialActions = () => {
  const context = useContext(SocialActionsContext);
  if (context === undefined) {
    throw new Error(
      "useSocialActions must be used within a SocialActionsProvider",
    );
  }
  return context;
};
