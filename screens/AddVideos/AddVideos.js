import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetFooter } from "@gorhom/bottom-sheet";
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
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { Item } from "react-navigation-header-buttons";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AddVideoItem from "../../components/AddVideoItem/AddVideoItem";
import AddVideoSheet from "../../components/AddVideoSheet/AddVideoSheet";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import { useCreateListingContext } from "../../contexts/CreateListingContext";

const VIDEO_INSETS = 200;
const MAX_VIDEO_MS = 180000;
const VIDEO_BOTTOM_ADJUSTMENTS = 20;

const initialState = {
  id: "",
  uri: "",
  mimeType: "",
  fileName: "",
  privacy: "public",
  sections: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLEAR_VIDEO_DATA":
      return initialState;
    case "SET_VIDEO_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_VIDEO_SECTIONS":
      return {
        ...state,
        sections: action.payload,
      };
    default:
      return state;
  }
};

const AddVideos = ({ isFocused = true }) => {
  const [currentVideo, dispatch] = useReducer(reducer, initialState, undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditingSections, setIsEditingSections] = useState(false);
  const [shouldVideosPlay, setShouldVideosPlay] = useState(false);

  const flatListRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const { listingState, setListingData } = useCreateListingContext();
  const { height } = useWindowDimensions();
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const toast = useToast();

  useEffect(() => {
    // Scroll to the video if the videoId is provided
    if (route.params?.videoId && listingState.videos.length > 0) {
      const videoIndex = listingState.videos.findIndex(
        (video) => video.id === route.params.videoId,
      );

      if (videoIndex !== -1) {
        // Scroll to the video after a timeout
        scrollTimeoutRef.current = setTimeout(() => {
          flatListRef.current.scrollToIndex({
            index: videoIndex,
            viewPosition: 0.1,
          });

          // Reset videoId after scrolling
          navigation.setParams({ videoId: null });
        }, 300);
      }
    }
  }, [listingState.videos, route.params?.videoId]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const videoActions = useMemo(
    () => ({
      setCurrentVideo: (payload) =>
        dispatch({ type: "SET_VIDEO_DATA", payload }),
      clearCurrentVideo: () => dispatch({ type: "CLEAR_VIDEO_DATA" }),
    }),
    [],
  );

  const onOpenModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShouldVideosPlay(true);
    setIsEditingSections(false);
    setIsModalVisible(false);
    videoActions.clearCurrentVideo();
  }, []);

  const onAddVideo = useCallback(async () => {
    if (listingState.videos.length >= 1) {
      Alert.alert(
        "Limit reached",
        "You can only add one video to your listing.",
        [{ text: "OK" }],
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        // allowsMultipleSelection: true,
        videoMaxDuration: 180,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.Low,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
      });

      if (!result.canceled) {
        // Filter out existing videos
        const existingVideos = new Set(
          listingState.videos.map((video) => video.fileName),
        );
        const newVideos = result.assets
          .filter(({ duration, fileName }) => {
            if (duration > MAX_VIDEO_MS) {
              toast.show(`${fileName} should be less than 3 mins`, {
                style: toastStyles.toastInsetFooter,
              });
              return false;
            }
            return !existingVideos.has(fileName);
          })
          .map((video) => ({
            id: video.uri,
            uri: video.uri,
            mimeType: video.mimeType,
            fileName: video.fileName,
            privacy: "public",
            isLocal: true,
          }));

        setListingData({ videos: [...listingState.videos, ...newVideos] });

        // Scroll to the end of the list when a new video is added
        scrollTimeoutRef.current = setTimeout(() => {
          flatListRef.current?.scrollToEnd();
        }, 300);
      }
    } catch (error) {
      console.log("Error adding video", error);
      Alert.alert("Error adding video", "Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [listingState.videos]);

  useEffect(() => {
    // Show add video modal if the videoId is 'new'
    if (route.params?.videoId === "new") {
      onAddVideo();

      // Reset videoId after adding a video
      navigation.setParams({ videoId: null });
    }
  }, [onAddVideo, route.params?.imageId]);

  const onStartEditingVideo = useCallback((video) => {
    setShouldVideosPlay(false);
    videoActions.setCurrentVideo(video);
    onOpenModal();
  }, []);

  const onFinishedEditingVideo = useCallback(
    (updatedVideo) => {
      const updatedVideos = listingState.videos.map((video) =>
        video.id === updatedVideo.id ? updatedVideo : video,
      );

      setListingData({ videos: updatedVideos });
      onCloseModal();
    },
    [listingState.videos],
  );

  const onDeleteVideo = useCallback(
    (itemId) => {
      // Filter out the video with the given id
      const filteredVideos = listingState.videos.filter(
        (video) => video.id !== itemId,
      );
      setListingData({ videos: filteredVideos });

      videoActions.clearCurrentVideo();
      onCloseModal();
    },
    [listingState.videos],
  );

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <AppFooter>
          <View style={globalStyles.buttonRow}>
            <ButtonLarge
              flexFull
              color={Colors.red}
              onPress={() => onDeleteVideo(currentVideo.id)}
            >
              Delete
            </ButtonLarge>
            <ButtonLarge
              flexFull
              disabled={currentVideo.sections.some((video) => !video.label)}
              onPress={() => {
                onFinishedEditingVideo(currentVideo);
              }}
            >
              Save Changes
            </ButtonLarge>
          </View>
        </AppFooter>
      </BottomSheetFooter>
    ),
    [currentVideo, onFinishedEditingVideo, onDeleteVideo],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <AddVideoItem
        item={item}
        shouldPlay={shouldVideosPlay}
        onEditVideo={() => onStartEditingVideo(item)}
        onDeleteVideo={() => onDeleteVideo(item.id)}
      />
    ),
    [onDeleteVideo, onStartEditingVideo, shouldVideosPlay],
  );

  const headerRight = useCallback(() => {
    return (
      <Item
        title="Add"
        onPress={onAddVideo}
        IconComponent={MaterialCommunityIcons}
        iconName="plus"
        color="white"
        iconSize={25}
      />
    );
  }, [onAddVideo]);

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
    <>
      <View style={globalStyles.flexFull}>
        {isLoading && <ActivityIndicator style={style.loadingCircle} />}

        <FlatList
          ref={flatListRef}
          data={listingState.videos}
          renderItem={renderItem}
          contentContainerStyle={style.contentContainer}
          snapToInterval={height - VIDEO_INSETS}
          snapToAlignment="center"
          decelerationRate="fast"
          disableIntervalMomentum
          ListEmptyComponent={
            <View style={globalStyles.flexCenter}>
              <Text style={globalStyles.emptyTextCenter}>
                No videos added yet.
              </Text>
            </View>
          }
          ListFooterComponent={
            <View
              style={{ height: insets.bottom - VIDEO_BOTTOM_ADJUSTMENTS }}
            />
          }
        />
      </View>

      <AddVideoSheet
        isVisible={isModalVisible}
        onClose={onCloseModal}
        footerComponent={renderFooter}
        currentVideo={currentVideo}
        onVideoChange={videoActions.setCurrentVideo}
        isEditing={isEditingSections}
        onEditingChange={() => setIsEditingSections(!isEditingSections)}
      />
    </>
  );
};

export default AddVideos;
