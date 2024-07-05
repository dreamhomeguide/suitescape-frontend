import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Item } from "react-navigation-header-buttons";

import style from "../../assets/styles/createListingStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AddImageItem from "../../components/AddImageItem/AddImageItem";
import SliderModalPhoto from "../../components/SliderModalPhoto/SliderModalPhoto";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import { ModalGalleryProvider } from "../../contexts/ModalGalleryContext";

const AddImages = ({ isFocused = true }) => {
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const { listingState, setListingData } = useCreateListingContext();
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Scroll to the image if the imageId is passed in the route params
    if (route.params?.imageId && listingState.images.length > 0) {
      const imageIndex = listingState.images.findIndex(
        (image) => image.id === route.params.imageId,
      );

      if (imageIndex !== -1) {
        // Scroll to the image after a timeout
        scrollTimeoutRef.current = setTimeout(() => {
          flatListRef.current.scrollToIndex({
            index: imageIndex,
            viewPosition: 0.1,
          });

          // Reset the imageId after scrolling
          navigation.setParams({ imageId: null });
        }, 300);
      }
    }
  }, [listingState.images, route.params?.imageId]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const onAddImage = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Filter out existing images
        const existingImages = new Set(
          listingState.images.map((image) => image.fileName),
        );
        const newImages = result.assets
          .filter((image) => !existingImages.has(image.fileName))
          .map((image) => ({
            id: image.uri,
            uri: image.uri,
            mimeType: image.mimeType,
            fileName: image.fileName,
            privacy: "public",
            isLocal: true,
          }));

        setListingData({ images: [...listingState.images, ...newImages] });

        // Scroll to the end of the list when a new image is added
        scrollTimeoutRef.current = setTimeout(() => {
          flatListRef.current?.scrollToEnd();
        }, 300);
      }
    } catch (error) {
      console.log("Error adding image/s", error);
      Alert.alert("Error adding image/s", "Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [listingState.images]);

  useEffect(() => {
    // Show add image modal if the imageId is 'new'
    if (route.params?.imageId === "new") {
      onAddImage();

      // Reset imageId after adding an image
      navigation.setParams({ imageId: null });
    }
  }, [onAddImage, route.params?.imageId]);

  const onDeleteImage = useCallback(
    (itemId) => {
      // Filter out the image with the given id
      const filteredImages = listingState.images.filter(
        (image) => image.id !== itemId,
      );

      setListingData({ images: filteredImages });
    },
    [listingState.images],
  );

  const onSwitchVisibility = useCallback(
    (itemId) => {
      let publicImagesCount = 0;

      // Filter out the image with the given id
      const updatedImages = listingState.images.map((image) => {
        // Count the number of public images
        if (image.privacy === "public") {
          publicImagesCount++;
        }

        if (image.id === itemId) {
          // Check if there is at least one public image
          if (image.privacy === "public" && publicImagesCount <= 1) {
            Alert.alert(
              "Cannot make image private",
              "At least one image must be public.",
            );
            return image;
          }

          return {
            ...image,
            privacy: image.privacy === "public" ? "private" : "public",
          };
        }

        return image;
      });

      setListingData({ images: updatedImages });
    },
    [listingState.images],
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <AddImageItem
        item={item}
        index={index}
        onSwitch={() => onSwitchVisibility(item.id)}
        onDelete={() => onDeleteImage(item.id)}
      />
    ),
    [onDeleteImage, onSwitchVisibility],
  );

  const headerRight = useCallback(() => {
    return (
      <Item
        title="Add"
        onPress={onAddImage}
        IconComponent={MaterialCommunityIcons}
        iconName="plus"
        color="white"
        iconSize={25}
      />
    );
  }, [onAddImage]);

  useLayoutEffect(() => {
    if (isFocused && isScreenFocused) {
      navigation.setOptions({
        headerRight,
      });
    }

    return () => {
      navigation.setOptions({
        headerRight: undefined,
      });
    };
  }, [headerRight, isFocused, isScreenFocused, navigation]);

  return (
    <ModalGalleryProvider>
      <View style={globalStyles.flexFull}>
        {isLoading && <ActivityIndicator style={style.loadingCircle} />}

        <FlatList
          ref={flatListRef}
          data={listingState.images}
          renderItem={renderItem}
          contentContainerStyle={style.contentContainer}
          ListEmptyComponent={
            <View style={globalStyles.flexCenter}>
              <Text style={globalStyles.emptyTextCenter}>
                No images added yet.
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: insets.bottom }} />}
        />
      </View>

      <SliderModalPhoto imageData={listingState.images} showIndex galleryMode />
    </ModalGalleryProvider>
  );
};

export default AddImages;
