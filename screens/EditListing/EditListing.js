import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import style from "./EditListingStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import formInputStyles from "../../components/FormInput/FormInputStyles";
import FormPicker from "../../components/FormPicker/FormPicker";
import FormStepper from "../../components/FormStepper/FormStepper";
import ListingPriceInput from "../../components/ListingPriceInput/ListingPriceInput";
import ListingTimeSelector from "../../components/ListingTimeSelector/ListingTimeSelector";
import SliderPreview from "../../components/SliderPreview/SliderPreview";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import mappingsData from "../../data/mappingsData";
import { Routes } from "../../navigation/Routes";
import { fetchListing, updateListing } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import {
  getAddonsValueText,
  getNearbyPlacesValueText,
  getRoomsValueText,
} from "../../utils/getValueText";
import { accommodationTypes } from "../TypeOfAccommodation/TypeOfAccommodation";
import { facilityTypes } from "../TypeOfFacility/TypeOfFacility";

const EditListing = ({ route, navigation }) => {
  const listingId = route.params.listingId;

  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listings", listingId],
    queryFn: () => fetchListing({ listingId }),
  });

  const { listingState, setListingData, clearListingInfo } =
    useCreateListingContext();
  const queryClient = useQueryClient();

  const roomsValueText = useMemo(
    () => getRoomsValueText(listingState.rooms),
    [listingState.rooms],
  );

  const addonsValueText = useMemo(
    () => getAddonsValueText(listingState.addons),
    [listingState.addons],
  );

  const nearbyPlacesValueText = useMemo(
    () => getNearbyPlacesValueText(listingState.nearbyPlaces),
    [listingState.nearbyPlaces],
  );

  const updateListingMutation = useMutation({
    mutationFn: updateListing,
    onSuccess: (response) => {
      handleApiResponse({
        response,
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["host", "listings"],
          });

          await queryClient.invalidateQueries({
            queryKey: ["listings", listingId],
          });

          navigation.navigate(Routes.FEEDBACK, {
            type: "success",
            title: "Congratulations",
            subtitle: "Listing updated successfully",
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

  const onUpdateListing = useCallback(() => {
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
      // If the image is already uploaded and has an id
      if (!image.isLocal) {
        formData.append(`images[${index}]`, JSON.stringify(image));
        return;
      }

      formData.append(`images[${index}][file]`, {
        uri: image.uri,
        name: image.fileName,
        type: image.mimeType,
      });
      formData.append(`images[${index}][privacy]`, image.privacy);
    });

    // Add videos to formData
    listingState.videos.forEach((video, index) => {
      // If the video is already uploaded and has an id
      if (!video.isLocal) {
        formData.append(`videos[${index}]`, JSON.stringify(video));
        return;
      }

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

    if (!updateListingMutation.isPending) {
      updateListingMutation.mutate({
        listingId,
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
  }, [updateListingMutation.isPending, listingState]);

  useEffect(() => {
    // Sync listing data with context
    if (listing) {
      Object.entries(mappingsData).forEach(([state, userDataKey]) => {
        if (
          listing[userDataKey] !== undefined &&
          listing[userDataKey] !== null
        ) {
          // Convert time from ISO date to 12-hour format (12:00 AM)
          // if (state === "checkInTime" || state === "checkOutTime") {
          //   setListingData({
          //     [state]: format(listing[userDataKey], VALID_INPUT_TIME),
          //   });
          //   return;
          // }

          // Convert nearby places to object
          if (state === "nearbyPlaces") {
            setListingData({
              [state]: listing[userDataKey].reduce((acc, nearbyPlace) => {
                acc[nearbyPlace.name] = true;
                return acc;
              }, {}),
            });
            return;
          }

          setListingData({ [state]: listing[userDataKey] });
        }
      });
    }
  }, [listing]);

  useEffect(() => {
    return () => {
      // Clear listing info on unmount
      clearListingInfo();
    };
  }, []);

  const onAddImage = useCallback(
    (imageId) => {
      navigation.navigate(Routes.ADD_IMAGES, { imageId });
    },
    [navigation],
  );

  const onAddVideo = useCallback(
    (videoId) => {
      navigation.navigate(Routes.ADD_VIDEOS, { videoId });
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={80}
        style={globalStyles.flexFull}
      >
        <ScrollView
          contentInset={{ top: 10, bottom: 35 }}
          contentContainerStyle={style.contentContainer}
        >
          <FormInput
            label="Name of your listing"
            placeholder="Enter the name of your listing"
            value={listingState.name}
            onChangeText={(value) => setListingData({ name: value })}
            maxLength={100}
          />

          {/*{listingState.isEntirePlace && (*/}
          {/*  <FormInput*/}
          {/*    type="currency"*/}
          {/*    label="Entire Place Price"*/}
          {/*    placeholder="Enter the price of the entire place"*/}
          {/*    isNumberValue={false}*/}
          {/*    value={listingState.entirePlacePrice}*/}
          {/*    onChangeText={(value) => {*/}
          {/*      setListingData({ entirePlacePrice: value });*/}
          {/*    }}*/}
          {/*    onBlur={() => {*/}
          {/*      const newPrice = Number(listingState.entirePlacePrice);*/}
          {/*      setListingData({*/}
          {/*        entirePlacePrice: newPrice ? newPrice.toFixed(2) : "",*/}
          {/*      });*/}
          {/*    }}*/}
          {/*    keyboardType="number-pad"*/}
          {/*  />*/}
          {/*)}*/}

          <FormInput
            type="textarea"
            label="Description (Optional)"
            placeholder="Tell us about your listing"
            value={listingState.description}
            onChangeText={(value) => setListingData({ description: value })}
            maxLength={5000}
          />

          <FormPicker
            label="Facility Type"
            data={facilityTypes}
            value={listingState.facilityType}
            onSelected={(selected) =>
              setListingData({ facilityType: selected })
            }
          />

          <FormPicker
            label="Accommodation Type"
            data={accommodationTypes}
            value={listingState.isEntirePlace}
            onSelected={(selected) => {
              setListingData({ isEntirePlace: selected });
            }}
          />

          <ListingTimeSelector
            checkInTime={listingState.checkInTime}
            checkOutTime={listingState.checkOutTime}
            totalHours={listingState.totalHours}
            onTimeChange={(value, type) => setListingData({ [type]: value })}
            onTotalHoursChange={(value, isSameDay) =>
              setListingData({
                totalHours: value,
                isCheckInOutSameDay: isSameDay,
              })
            }
            initialIsSameDay={listingState.isCheckInOutSameDay}
          />

          {listingState.isEntirePlace && (
            <>
              <ListingPriceInput
                weekDayPrice={listingState.entirePlaceWeekdayPrice}
                weekendPrice={listingState.entirePlaceWeekendPrice}
                onWeekdayPriceChange={(value) => {
                  setListingData({ entirePlaceWeekdayPrice: value });
                }}
                onWeekendPriceChange={(value) => {
                  setListingData({ entirePlaceWeekendPrice: value });
                }}
                initialIsSamePrice={
                  listingState.entirePlaceWeekdayPrice ===
                  listingState.entirePlaceWeekendPrice
                }
              />

              <FormStepper
                label="Adult"
                placeholder="Adult"
                value={listingState.adultCapacity}
                onValueChange={(value) => {
                  setListingData({ adultCapacity: value });
                }}
              />
              <FormStepper
                label="Children"
                placeholder="Children"
                value={listingState.childCapacity}
                onValueChange={(value) => {
                  setListingData({ childCapacity: value });
                }}
              />
            </>
          )}

          <Pressable
            style={({ pressed }) => pressedOpacity(pressed)}
            onPress={() => {
              navigation.navigate(Routes.ADDRESS, {
                location: listingState.location,
              });
            }}
          >
            <FormInput
              label="Address"
              placeholder="Edit Address"
              value={listingState.location}
              containerStyle={{ pointerEvents: "none" }}
            />
          </Pressable>

          {!listingState.isEntirePlace && (
            <Pressable
              style={({ pressed }) => pressedOpacity(pressed)}
              onPress={() => {
                navigation.navigate(Routes.ADD_ROOMS, { listingId });
              }}
            >
              <FormInput
                label="Rooms"
                placeholder="Edit Rooms"
                value={roomsValueText}
                containerStyle={{ pointerEvents: "none" }}
              />
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => pressedOpacity(pressed)}
            onPress={() => {
              navigation.navigate(Routes.LISTING_ADDONS);
            }}
          >
            <FormInput
              label="Add-ons"
              placeholder="Edit Add-ons"
              value={addonsValueText}
              containerStyle={{ pointerEvents: "none" }}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => pressedOpacity(pressed)}
            onPress={() => {
              navigation.navigate(Routes.ADD_NEARBY_PLACES);
            }}
          >
            <FormInput
              label="Nearby Places"
              placeholder="Edit Nearby Places"
              value={nearbyPlacesValueText}
              containerStyle={{ pointerEvents: "none" }}
            />
          </Pressable>

          <View style={style.previewContainer}>
            <Text style={formInputStyles.label}>Images</Text>
            <SliderPreview
              type="image"
              data={listingState.images}
              onItemPress={(item) => onAddImage(item.id)}
              onAddItem={() => onAddImage("new")}
            />
          </View>

          <View style={style.previewContainer}>
            <Text style={formInputStyles.label}>Videos</Text>
            <SliderPreview
              type="video"
              data={listingState.videos}
              onItemPress={(item) => onAddVideo(item.id)}
              onAddItem={() => onAddVideo("new")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppFooter>
        <ButtonLarge onPress={onUpdateListing}>Save Changes</ButtonLarge>
      </AppFooter>

      <DialogLoading
        title={
          updateListingMutation.isPending
            ? `Uploading...${uploadProgress > 0 ? uploadProgress + "%" : ""}`
            : undefined
        }
        visible={isLoading || updateListingMutation.isPending}
      />
    </>
  );
};

export default EditListing;
