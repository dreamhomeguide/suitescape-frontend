import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/searchStyles";
import FormInput from "../../components/FormInput/FormInput";
import SearchAutoCompleteItem from "../../components/SearchAutoCompleteItem/SearchAutoCompleteItem";
import SearchRecentItem from "../../components/SearchRecentItem/SearchRecentItem";
import SearchResultItem from "../../components/SearchResultItem/SearchResultItem";
import { Routes } from "../../navigation/Routes";
import { searchListings } from "../../services/apiService";
import { handleApiResponse } from "../../utils/apiHelpers";
import convertDateFormat from "../../utils/dateConverter";
import formatRange from "../../utils/rangeFormatter";

// const SAMPLE_SEARCHES = [
//   {
//     id: 1,
//     location: "Palawan, Philippines",
//     details: "Nov 29 - 30 (3 Adults)",
//   },
//   {
//     id: 2,
//     location: "Pampanga, Philippines",
//     details: "Nov 29 - 30 (3 Adults)",
//   },
//   {
//     id: 3,
//     location: "Pangasinan, Philippines",
//     details: "Nov 29 - 30 (3 Adults)",
//   },
// ];

const MAX_RECENT_SEARCHES = 50;

const Search = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteSearches, setAutoCompleteSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState([]);
  const [showAutoComplete, setShowAutoComplete] = useState(true);

  const AbortController = window.AbortController;

  const abortControllerRef = useRef(new AbortController());
  const insets = useSafeAreaInsets();

  const { prevDestination, checkIn, checkOut, guests } = route.params || {};

  // Set search query from previously entered destination
  useEffect(() => {
    if (prevDestination) {
      setSearchQuery(prevDestination);
      setAutoCompleteSearches([prevDestination]);
    }
  }, [prevDestination]);

  // Get stored recent searches from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const recentSearches = await AsyncStorage.getItem("recentSearches");

        if (!recentSearches) {
          // Temporary to populate recent searches
          // console.log("Using sample searches...");
          // setRecentSearches(SAMPLE_SEARCHES);
          return;
        }

        setRecentSearches(JSON.parse(recentSearches));
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  const itemDetails = useMemo(() => {
    const date = formatRange(
      convertDateFormat(checkIn),
      convertDateFormat(checkOut),
    );

    return `${date} (${guests} Guests)`;
  }, [checkIn, checkOut, guests]);

  const fetchResultsMutation = useMutation({
    mutationFn: searchListings,
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: (res) => {
          // console.log(res);
          // console.log(showAutoComplete);

          if (showAutoComplete) {
            setAutoCompleteSearches(
              res.length > 0 ? res.map((item) => item.location) : [searchQuery],
            );
          }

          const results = res.map((item) => ({
            id: item.id,
            location: item.location,
            details: itemDetails,
          }));

          setResults(results);
        },
      }),
  });

  const moveSearchToTop = useCallback((itemId) => {
    setRecentSearches((prevSearches) => {
      const index = prevSearches.findIndex((query) => query.id === itemId);

      if (index !== -1) {
        const newSearches = [...prevSearches];
        newSearches.splice(index, 1);
        newSearches.unshift(prevSearches[index]);

        AsyncStorage.setItem(
          "recentSearches",
          JSON.stringify(newSearches),
        ).catch((err) => console.log(err));

        return newSearches;
      }

      // Index not found so return previous searches
      return prevSearches;
    });
  }, []);

  const renderAutoCompleteSearches = useCallback(() => {
    if (autoCompleteSearches.length === 0 || !showAutoComplete) {
      return null;
    }

    const renderItem = ({ item }) => (
      <SearchAutoCompleteItem
        item={item}
        onPress={() => {
          // Use item as search query
          setSearchQuery(item);

          // Create new search object
          createNewSearch(item);

          // Remove all autocomplete suggestions
          setAutoCompleteSearches([]);

          // Remove this code, so it doesn't go to results immediately
          setShowAutoComplete(false);

          if (!fetchResultsMutation.isPending) {
            fetchResultsMutation.mutate({
              query: item,
              signal: abortControllerRef.current.signal,
            });
          }
        }}
      />
    );

    return (
      <FlatList
        data={autoCompleteSearches}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
      />
    );
  }, [autoCompleteSearches, showAutoComplete, fetchResultsMutation.isPending]);

  const renderRecentSearches = useCallback(() => {
    if (recentSearches.length === 0 && !searchQuery) {
      return (
        <Text style={globalStyles.emptyTextCenter}>No recent searches</Text>
      );
    }

    if (searchQuery || autoCompleteSearches.length > 0 || results.length > 0) {
      return null;
    }

    const renderItem = ({ item }) => (
      <SearchRecentItem
        item={item}
        onPress={() => {
          setSearchQuery(item.location);

          // Remove this code so it goes to autocomplete first
          setAutoCompleteSearches([]);
          setShowAutoComplete(false);

          if (!fetchResultsMutation.isPending) {
            fetchResultsMutation.mutate({
              query: item.location,
              signal: abortControllerRef.current.signal,
            });
          }

          // Move item to top of recent searches
          moveSearchToTop(item.id);
        }}
        onClose={() => {
          Alert.alert(
            "Delete item?",
            "Are you sure you want to delete this item?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  setRecentSearches((prevSearches) => {
                    const newSearches = prevSearches.filter(
                      (query) => query.id !== item.id,
                    );

                    if (newSearches.length === 0) {
                      AsyncStorage.removeItem("recentSearches").catch((err) =>
                        console.log(err),
                      );
                      return [];
                    }

                    AsyncStorage.setItem(
                      "recentSearches",
                      JSON.stringify(newSearches),
                    ).catch((err) => console.log(err));

                    return newSearches;
                  });
                },
              },
            ],
          );
        }}
      />
    );

    return (
      <View>
        <Text style={style.searchHeaderText}>Recent Searches</Text>
        <FlatList
          data={recentSearches}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }, [
    recentSearches,
    searchQuery,
    autoCompleteSearches,
    results,
    fetchResultsMutation.isPending,
  ]);

  const renderResults = useCallback(() => {
    if (fetchResultsMutation.isPending) {
      return <ActivityIndicator style={globalStyles.loadingCircle} />;
    }

    if (results.length === 0 && !showAutoComplete && searchQuery) {
      return (
        <Text style={globalStyles.emptyTextCenter}>No results found.</Text>
      );
    }

    if (results.length === 0 || showAutoComplete) {
      return null;
    }

    const renderItem = ({ item }) => (
      <SearchResultItem
        item={item}
        onPress={() => {
          navigation.navigate({
            name: Routes.FILTER,
            params: { destination: item.location },
            merge: true,
          });
        }}
      />
    );

    return (
      <View>
        <Text style={style.searchHeaderText}>Results</Text>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={globalStyles.rowGapSmall}
          scrollEnabled={false}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }, [
    fetchResultsMutation.isPending,
    navigation,
    results,
    searchQuery,
    showAutoComplete,
  ]);

  const createNewSearch = useCallback(
    (query) => {
      // Check if search already exists in recent searches
      const existingSearch = recentSearches.find(
        (search) => search.location === query,
      );
      if (existingSearch) {
        moveSearchToTop(existingSearch.id);
        return;
      }

      const newSearch = {
        id: Crypto.randomUUID(),
        location: query,
        details: itemDetails,
      };

      // Add search to recent searches
      setRecentSearches((prevSearches) => {
        const newSearches = [newSearch, ...prevSearches];

        if (newSearches.length > MAX_RECENT_SEARCHES) {
          newSearches.pop();
        }

        AsyncStorage.setItem(
          "recentSearches",
          JSON.stringify(newSearches),
        ).catch((err) => console.log(err));

        return newSearches;
      });
    },
    [searchQuery, itemDetails, recentSearches],
  );

  return (
    <View style={globalStyles.flexFull}>
      <FormInput
        // ref={textInputRef}
        type="clearable"
        value={searchQuery}
        onFocus={() => setShowAutoComplete(true)}
        onBlur={() => setShowAutoComplete(false)}
        onChangeText={(value) => {
          // Helps in reducing server load
          if (!value) {
            setSearchQuery("");
            setResults([]);

            // Bring the autocomplete back, but with no content, so it won't show
            setAutoCompleteSearches([]);
            setShowAutoComplete(true);

            // Abort fetch results request, and create a new one to allow new requests
            abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();
            return;
          }

          if (!fetchResultsMutation.isPending) {
            fetchResultsMutation.mutate({
              query: value,
              signal: abortControllerRef.current.signal,
            });
          }

          setSearchQuery(value);
        }}
        placeholder="Where To?"
        returnKeyType="search"
        containerStyle={style.searchInputContainer}
        onClear={() => {
          setSearchQuery("");
          setResults([]);

          // Bring the autocomplete back, but with no content, so it won't show
          setAutoCompleteSearches([]);
          setShowAutoComplete(true);

          // Abort fetch results request, and create a new one to allow new requests
          abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();
        }}
        onSubmitEditing={() => {
          // If no search query, go back to filter screen
          if (!searchQuery) {
            navigation.navigate({
              name: Routes.FILTER,
              params: { destination: "" },
              merge: true,
            });
            return;
          }

          // Remove all autocomplete suggestions
          setAutoCompleteSearches([]);

          // Used because of the delay in hiding the autocomplete
          setShowAutoComplete(false);

          // Create new search object
          createNewSearch(searchQuery);

          if (!fetchResultsMutation.isPending) {
            fetchResultsMutation.mutate({
              query: searchQuery,
              signal: abortControllerRef.current.signal,
            });
          }
        }}
      />
      <ScrollView
        contentInset={{ bottom: insets.bottom }}
        contentContainerStyle={style.searchContainer}
        keyboardShouldPersistTaps="handled"
      >
        {renderAutoCompleteSearches()}
        {renderResults()}
        {renderRecentSearches()}
      </ScrollView>
    </View>
  );
};

export default Search;
