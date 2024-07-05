import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { ResizeMode } from "expo-av";
import _ from "lodash";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Switch } from "react-native-ui-lib";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import { baseURL } from "../../services/SuitescapeAPI";
import capitalizedText from "../../utils/textCapitalizer";
import AddVideoSheetItem from "../AddVideoSheetItem/AddVideoSheetItem";
import BottomSheet from "../BottomSheet/BottomSheet";
import BottomSheetHeader from "../BottomSheetHeader/BottomSheetHeader";
import Button from "../Button/Button";
import VideoItem from "../VideoItem/VideoItem";
import VideoItemProgressBar from "../VideoItemProgressBar/VideoItemProgressBar";

const AddVideoSheet = ({
  isVisible,
  onClose,
  footerComponent,
  currentVideo,
  onVideoChange,
  isEditing,
  onEditingChange,
}) => {
  const [duration, setDuration] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const prevVideoRef = useRef(null);
  const videoRef = useRef(null);

  const { listingState } = useCreateListingContext();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Save the current video reference
    prevVideoRef.current = isVisible ? currentVideo : null;
  }, [isVisible]);

  const isNotChanged = useMemo(() => {
    if (!currentVideo || !prevVideoRef.current) {
      return true;
    }
    return _.isEqual(currentVideo, prevVideoRef.current) && !isEditing;
  }, [currentVideo, isEditing]);

  const handleHeaderClose = useCallback(() => {
    if (isNotChanged) {
      onClose();
      return;
    }

    Alert.alert(
      "Discard Changes?",
      "Are you sure you want to discard changes?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            onClose && onClose();
            setDuration(0);
            setCurrentProgress(0);
          },
        },
      ],
    );
  }, [isNotChanged, onClose]);

  const onAddSection = useCallback(() => {
    const timeStamp = format(currentProgress, "mm:ss");

    // Check if timestamp exists
    if (
      currentVideo.sections.some(
        (section) => format(section.milliseconds, "mm:ss") === timeStamp,
      )
    ) {
      Alert.alert(
        `Section already exists (${timeStamp})`,
        "Please choose a different time.",
      );
      return;
    }

    const newSection = {
      milliseconds: currentProgress,
      label: "",
    };

    const updatedSections = [...currentVideo.sections, newSection];

    // Sort sections by timeStamp
    updatedSections.sort((a, b) => a.milliseconds - b.milliseconds);

    onVideoChange?.({ sections: updatedSections });
  }, [currentProgress, currentVideo.sections, onVideoChange]);

  const onDeleteSection = useCallback(
    (milliseconds) => {
      const updatedSections = currentVideo.sections.filter(
        (section) => section.milliseconds !== milliseconds,
      );

      onVideoChange?.({ sections: updatedSections });
    },
    [currentVideo.sections, onVideoChange],
  );

  const onPlaybackStatusUpdate = useCallback(
    ({ durationMillis, positionMillis }) => {
      if (durationMillis) {
        setDuration(durationMillis);
      }
      if (!isSeeking) {
        setCurrentProgress(positionMillis);
      }
    },
    [isSeeking],
  );

  const onSwitchPrivacy = useCallback(() => {
    const publicVideosCount = listingState.videos.filter(
      (video) => video.privacy === "public",
    ).length;

    // Check if there is at least one public video
    if (currentVideo.privacy === "public" && publicVideosCount <= 1) {
      Alert.alert(
        "Cannot make video private",
        "At least one video must be public.",
      );
      return;
    }

    onVideoChange?.({
      privacy: currentVideo.privacy === "private" ? "public" : "private",
    });
  }, [currentVideo.privacy, listingState.videos, onVideoChange]);

  const onLabelChange = useCallback(
    (item, value) => {
      const updatedSections = currentVideo.sections.map((section) =>
        section.milliseconds === item.milliseconds
          ? { ...section, label: value }
          : section,
      );

      onVideoChange?.({ sections: updatedSections });
    },
    [currentVideo.sections, onVideoChange],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <AddVideoSheetItem
        item={item}
        onLabelChange={(value) => onLabelChange(item, value)}
        onDelete={() => onDeleteSection(item.milliseconds)}
      />
    ),
    [onDeleteSection, onLabelChange],
  );

  return (
    <BottomSheet
      visible={isVisible}
      footerComponent={footerComponent}
      enablePanDownToClose={isNotChanged}
      dismissOnBackdropPress={isNotChanged}
      onDismiss={onClose}
      fullScreen={isEditing}
    >
      <BottomSheetHeader label="Edit Video" onClose={handleHeaderClose} />

      {currentVideo && (
        <BottomSheetScrollView
          contentContainerStyle={style.gapSheetContainer}
          contentInset={{ bottom: insets.bottom }}
        >
          <Button outlined onPress={onEditingChange}>
            {isEditing ? "Hide" : "Edit Sections"}
          </Button>

          {isEditing && (
            <>
              <View>
                <VideoItem
                  ref={videoRef}
                  videoUri={
                    currentVideo.isLocal
                      ? currentVideo.uri
                      : baseURL + currentVideo.url
                  }
                  width="100%"
                  videoStyle={style.videoPreview}
                  initialIsPaused
                  onPlaybackUpdate={onPlaybackStatusUpdate}
                  resizeMode={ResizeMode.CONTAIN}
                />

                <VideoItemProgressBar
                  visible
                  videoRef={videoRef}
                  duration={duration}
                  progress={currentProgress}
                  sections={currentVideo.sections}
                  onSeekStart={() => {
                    setIsSeeking(true);
                  }}
                  onProgressChange={(val) => {
                    setCurrentProgress(val);
                    setIsSeeking(true);
                  }}
                  onSeekEnd={() => {
                    setIsSeeking(false);
                  }}
                  showTimeStamp
                />
              </View>

              <Button onPress={onAddSection}>Add Section</Button>
            </>
          )}

          <View style={globalStyles.buttonRowSmall}>
            <Text>{capitalizedText(currentVideo.privacy)}</Text>
            <Switch
              value={currentVideo.privacy === "private"}
              onValueChange={onSwitchPrivacy}
              onColor={Colors.blue}
            />
          </View>

          {isEditing && (
            <FlatList
              data={currentVideo.sections}
              keyExtractor={(item) => item.milliseconds.toString()}
              contentContainerStyle={globalStyles.largeContainerGap}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          )}
        </BottomSheetScrollView>
      )}
    </BottomSheet>
  );
};

export default memo(AddVideoSheet);
