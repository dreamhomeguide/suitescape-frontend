import { FontAwesome6 } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import style from "./ListingsStyles";
import { Colors } from "../../assets/Colors";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import FormInput from "../../components/FormInput/FormInput";
import HostListingItem from "../../components/HostListingItem/HostListingItem";
import IconBadge from "../../components/IconBadge/IconBadge";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import { SwipeableProvider } from "../../contexts/SwipeableContext";
import useVideoTranscodingSubscription from "../../hooks/useVideoTranscodingSubscription";
import { Routes } from "../../navigation/Routes";
import { fetchHostListings } from "../../services/apiService";

const Listings = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSwipeRef = useRef(null);

  const { subscribeToVideoTranscoding, allTranscodeProgress } =
    useVideoTranscodingSubscription();
  const { syncTranscodeProgress } = useCreateListingContext();
  const isFocused = useIsFocused();

  // Subscribe to video transcoding updates
  useEffect(() => {
    subscribeToVideoTranscoding();
  }, []);

  // Sync transcoding progress with the context
  useEffect(() => {
    syncTranscodeProgress(allTranscodeProgress);
  }, [allTranscodeProgress]);

  const {
    data: listings,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["host", "listings"],
    queryFn: fetchHostListings,
  });

  const filteredListings = useMemo(
    () =>
      listings?.filter((listing) =>
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [listings, searchQuery],
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      console.log("Listings refetched");
    } catch (err) {
      console.log(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }) => <HostListingItem item={item} />,
    [],
  );

  const EmptyListComponent = useCallback(() => {
    return isFetched ? (
      <View style={globalStyles.flexCenter}>
        <Text style={globalStyles.emptyTextCenter}>No listings yet.</Text>
      </View>
    ) : (
      <ActivityIndicator style={globalStyles.loadingCircle} />
    );
  }, [isFetched]);

  return (
    <SafeAreaView
      style={globalStyles.flexFull}
      edges={["top", "right", "left"]}
    >
      <StatusBar style={isFocused ? "dark" : "light"} animated />

      <View style={style.headerContainer}>
        <View style={style.headerContentContainer}>
          <Text style={style.headerTitle}>Your Listings</Text>
          <View style={style.headerButtonsContainer}>
            <Pressable style={({ pressed }) => pressedOpacity(pressed)}>
              <IconBadge
                count={0}
                labelColor="white"
                backgroundColor={Colors.red}
              >
                <FontAwesome6 name="bell" size={24} />
              </IconBadge>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate(Routes.ONBOARDING_LISTING)}
              style={({ pressed }) => pressedOpacity(pressed)}
            >
              <FontAwesome6 name="plus" size={24} />
            </Pressable>
          </View>
        </View>

        <FormInput
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          fieldStyle={style.searchField}
          containerStyle={style.searchContainer}
        />
      </View>

      <SwipeableProvider value={{ currentSwipeRef }}>
        <FlatList
          data={filteredListings}
          renderItem={renderItem}
          contentContainerStyle={style.contentContainer}
          ListEmptyComponent={EmptyListComponent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </SwipeableProvider>
    </SafeAreaView>
  );
};

export default Listings;
