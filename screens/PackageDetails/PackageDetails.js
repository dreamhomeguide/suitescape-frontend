import { BottomSheetFooter, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useReducer, useState } from "react";
import { Animated, Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import BottomSheet from "../../components/BottomSheet/BottomSheet";
import BottomSheetHeader from "../../components/BottomSheetHeader/BottomSheetHeader";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DetailsDescriptionView from "../../components/DetailsDescriptionView/DetailsDescriptionView";
import DetailsTitleView from "../../components/DetailsTitleView/DetailsTitleView";
import FormPicker from "../../components/FormPicker/FormPicker";
import SliderGalleryMode from "../../components/SliderGalleryMode/SliderGalleryMode";
import SliderModalPhoto from "../../components/SliderModalPhoto/SliderModalPhoto";
import { ModalGalleryProvider } from "../../contexts/ModalGalleryContext";
import useTransparentHeader from "../../hooks/useTransparentHeader";
import { Routes } from "../../navigation/Routes";
import { fetchPackage } from "../../services/apiService";
import { checkEmptyFieldsObj } from "../../utils/emptyFieldChecker";
import reducerSetter from "../../utils/reducerSetter";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const GALLERY_HEIGHT = WINDOW_HEIGHT / 1.6 - 50;

const PACKAGES = [
  { label: "One night stay", value: "one_night" },
  { label: "Two nights stay", value: "two_nights" },
  { label: "Three nights stay", value: "three_nights" },
];

const AVAILABLE_DATES = [
  { label: "May 28-30, 2024", value: "2024-05-28" },
  { label: "June 4-6, 2024", value: "2024-06-04" },
  { label: "June 11-13, 2024", value: "2024-06-11" },
  { label: "June 18-20, 2024", value: "2024-06-18" },
  { label: "June 25-27, 2024", value: "2024-06-25" },
];

const initialState = {
  packageOption: null,
  date: null,
};

const PackageDetails = ({ navigation, route }) => {
  const packageId = route.params?.packageId;

  const [state, setPackage] = useReducer(
    reducerSetter,
    initialState,
    undefined,
  );
  const [isModalVisible, setModalVisible] = useState(false);

  const { yOffset } = useTransparentHeader(GALLERY_HEIGHT / 3);
  const insets = useSafeAreaInsets();

  const { data: packageData } = useQuery({
    queryKey: ["packages", packageId],
    queryFn: () => fetchPackage(packageId),
  });

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <AppFooter>
          <ButtonLarge
            disabled={checkEmptyFieldsObj(state)}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate(Routes.FEEDBACK, {
                type: "success",
                title: "Congratulations",
                subtitle: "You Have Booked Successfully",
                screenToNavigate: Routes.VIDEO_FEED,
              });
            }}
          >
            Continue
          </ButtonLarge>
        </AppFooter>
      </BottomSheetFooter>
    ),
    [navigation, state],
  );

  return (
    <ModalGalleryProvider>
      <StatusBar
        animated
        translucent
        style="light"
        backgroundColor="rgba(0,0,0,0.2)"
      />

      <SliderModalPhoto imageData={packageData?.images} galleryMode />

      <View style={globalStyles.flexFull}>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: yOffset } } }],
            {
              useNativeDriver: true,
            },
          )}
          contentContainerStyle={globalStyles.rowGap}
          scrollEventThrottle={16}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            locations={[0, 0.3]}
            pointerEvents="none"
            style={{ height: GALLERY_HEIGHT, ...globalStyles.absoluteTop }}
          />

          <SliderGalleryMode
            imageData={packageData?.images}
            height={GALLERY_HEIGHT}
            showMode={false}
          />

          <DetailsTitleView title={packageData?.name} />

          <DetailsDescriptionView description={packageData?.description} />
        </Animated.ScrollView>

        <AppFooter>
          <ButtonLarge onPress={() => setModalVisible(true)}>
            Reserve
          </ButtonLarge>
        </AppFooter>
      </View>

      <BottomSheet
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
        footerComponent={renderFooter}
      >
        <BottomSheetHeader
          label="Customize Package"
          onClose={() => setModalVisible(false)}
        />

        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 15 }}
          contentInset={{ bottom: insets.bottom }}
        >
          <FormPicker
            data={PACKAGES}
            label="Package Options"
            placeholder="Select package option"
            value={state.packageOption}
            onSelected={(value) => setPackage({ packageOption: value })}
          />

          <FormPicker
            data={AVAILABLE_DATES}
            label="Available Dates"
            placeholder="Select date"
            value={state.date}
            onSelected={(value) => setPackage({ date: value })}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </ModalGalleryProvider>
  );
};

export default PackageDetails;
