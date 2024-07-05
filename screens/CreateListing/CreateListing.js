import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, BackHandler, Platform, View } from "react-native";
import PagerView from "react-native-pager-view";
import { ProgressBar } from "react-native-ui-lib";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import {
  useCreateListingContext,
  useValidation,
} from "../../contexts/CreateListingContext";
import mappingsData from "../../data/mappingsData";
import { Routes } from "../../navigation/Routes";
import { createListing } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import AddImages from "../AddImages/AddImages";
import AddNearbyPlaces from "../AddNearbyPlaces/AddNearbyPlaces";
import AddRooms from "../AddRooms/AddRooms";
import AddVideos from "../AddVideos/AddVideos";
import Address from "../Address/Address";
import ListingAddons from "../ListingAddons/ListingAddons";
import ListingInfo from "../ListingInfo/ListingInfo";
import ListingOptions from "../ListingOptions/ListingOptions";
import TypeOfAccommodation from "../TypeOfAccommodation/TypeOfAccommodation";
import TypeOfFacility from "../TypeOfFacility/TypeOfFacility";

const CreateListing = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pagerViewRef = useRef(null);
  const debounceRef = useRef(null);

  const { listingState, clearListingInfo } = useCreateListingContext();
  const isValidated = useValidation(currentPage);
  const queryClient = useQueryClient();

  // Clear listing info on unmount
  useEffect(() => {
    return () => {
      clearListingInfo();
    };
  }, []);

  const screens = useMemo(() => {
    const baseScreens = [
      {
        title: "Type of Facility",
        component: TypeOfFacility,
      },
      {
        title: "Type of Accommodation",
        component: TypeOfAccommodation,
      },
      {
        title: "Listing Information",
        component: ListingInfo,
      },
      {
        title: "Listing Options",
        component: ListingOptions,
      },
      {
        title: "Add Rooms",
        component: AddRooms,
        type: "multiple_rooms",
      },
      {
        title: "Add Images",
        component: AddImages,
      },
      {
        title: "Add Videos",
        component: AddVideos,
      },
      {
        title: "Address",
        component: Address,
      },
      {
        title: "Add Nearby Places (Optional)",
        component: AddNearbyPlaces,
      },
      {
        title: "Add-ons (Optional)",
        component: ListingAddons,
      },
    ];

    // If the listing is an entire place, don't include the AddRooms component
    if (listingState.isEntirePlace) {
      return baseScreens.filter((screen) => screen.type !== "multiple_rooms");
    }

    return baseScreens;
  }, [listingState.isEntirePlace]);

  const createListingMutation = useMutation({
    mutationFn: createListing,
    onSuccess: (response) => {
      handleApiResponse({
        response,
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["host", "listings"],
          });

          navigation.navigate(Routes.FEEDBACK, {
            type: "success",
            title: "Congratulations",
            subtitle: "Listing created successfully",
            screenToNavigate: Routes.LISTINGS,
          });
        },
      });
    },
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const onCreateListing = useCallback(() => {
    const formData = new FormData();

    Object.entries(listingState).forEach(([key, value]) => {
      if (key === "images" || key === "videos") {
        return;
      }

      formData.append(
        mappingsData[key],
        typeof value === "string" ? value : JSON.stringify(value),
      );
    });

    // Add images to formData
    listingState.images.forEach((image, index) => {
      formData.append(`images[${index}][file]`, {
        uri: image.uri,
        name: image.fileName,
        type: image.mimeType,
      });
      formData.append(`images[${index}][privacy]`, image.privacy);
    });

    // Add videos to formData
    listingState.videos.forEach((video, index) => {
      formData.append(`videos[${index}][file]`, {
        uri: video.uri,
        name: video.fileName,
        type: video.mimeType,
      });
      formData.append(`videos[${index}][privacy]`, video.privacy);
      formData.append(
        `videos[${index}][sections]`,
        JSON.stringify(video.sections),
      );
    });

    if (!createListingMutation.isPending) {
      createListingMutation.mutate({
        listingData: formData,
        config: {
          onUploadProgress: (progressEvent) => {
            const uploadProgress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            console.log("Upload Progress:", uploadProgress);

            setUploadProgress(uploadProgress);
          },
        },
      });
    }
  }, [createListingMutation.isPending, listingState]);

  const onPrev = useCallback(() => {
    if (debounceRef.current) {
      return;
    }

    setCurrentPage((prev) => {
      if (prev > 0) {
        pagerViewRef.current.setPage(prev - 1);
        return prev - 1;
      }
      return prev;
    });

    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
    }, 250);
  }, []);

  const onContinue = useCallback(() => {
    if (debounceRef.current) {
      return;
    }

    setCurrentPage((prev) => {
      if (prev < screens.length - 1) {
        pagerViewRef.current.setPage(prev + 1);
      } else {
        onCreateListing();
      }
      return prev + 1;
    });

    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
    }, 250);
  }, [onCreateListing, screens.length]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentPage === 0) {
          return false;
        }

        onPrev();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [currentPage, onPrev]),
  );

  useEffect(() => {
    return navigation.addListener("beforeRemove", (e) => {
      if (currentPage > 0 && currentPage < screens.length - 1) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Are you sure?",
          "Your progress will be discarded once you press back.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Discard",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }
    });
  }, [currentPage, navigation, screens.length]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: Platform.OS === "ios" && currentPage === 0,
      title: screens[currentPage]?.title || "Creating Listing...",
    });
  }, [currentPage]);

  return (
    <>
      <PagerView
        ref={pagerViewRef}
        style={globalStyles.flexFull}
        scrollEnabled={false}
      >
        {screens.map((screen, index) => {
          const ScreenComponent = screen.component;

          return ScreenComponent ? (
            <ScreenComponent key={index} isFocused={currentPage === index} />
          ) : null;
        })}
      </PagerView>

      <ProgressBar
        progress={(currentPage / screens.length) * 100}
        progressColor={Colors.blue}
        style={style.progress}
        fullWidth
      />

      <AppFooter containerStyle={globalStyles.containerGap}>
        <View style={globalStyles.buttonRow}>
          <ButtonLarge flexFull onPress={onPrev} disabled={currentPage === 0}>
            Previous
          </ButtonLarge>
          <ButtonLarge flexFull onPress={onContinue} disabled={!isValidated}>
            Continue
          </ButtonLarge>
        </View>
      </AppFooter>

      <DialogLoading
        title={`Uploading... ${uploadProgress > 0 ? uploadProgress + "%" : ""}`}
        visible={createListingMutation.isPending}
      />
    </>
  );
};

export default CreateListing;
