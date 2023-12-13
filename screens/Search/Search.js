import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import FormInput from "../../components/FormInput/FormInput";
import { Routes } from "../../navigation/Routes";

const SAMPLE_SEARCHES = [
  {
    id: 1,
    location: "Palawan, Philippines",
    details: "Nov 29 - 30 (3 Adults)",
  },
  {
    id: 2,
    location: "Pampanga, Philippines",
    details: "Nov 29 - 30 (3 Adults)",
  },
  {
    id: 3,
    location: "Pangasinan, Philippines",
    details: "Nov 29 - 30 (3 Adults)",
  },
];

const Search = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState([]);

  // Get stored recent searches from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const recentSearches = await AsyncStorage.getItem("recent-searches");

        if (!recentSearches) {
          // console.log("No recent searches");

          // Temporary to populate recent searches
          // console.log("Using sample searches...");
          setRecentSearches(SAMPLE_SEARCHES);
          return;
        }

        setRecentSearches(JSON.parse(recentSearches));
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // Set search query from previously entered destination
  useEffect(() => {
    if (route.params?.prevDestination) {
      setSearchQuery(route.params.prevDestination);
    }
  }, [route.params?.prevDestination]);

  const renderRecentSearches = () => {
    return (
      <>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            paddingHorizontal: 5,
            paddingTop: 20,
            paddingBottom: 5,
          }}
        >
          Recent Searches
        </Text>

        <FlatList
          data={recentSearches}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                columnGap: 10,
                marginHorizontal: 5,
                ...globalStyles.bottomGapSmall,
              }}
            >
              <Pressable
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  ...pressedOpacity(pressed),
                })}
                onPress={() => {
                  setSearchQuery(item.location);

                  setRecentSearches((prevSearches) => {
                    const index = prevSearches.findIndex(
                      (query) => query.id === item.id,
                    );

                    if (index !== -1) {
                      const newSearches = [...prevSearches];
                      newSearches.splice(index, 1);
                      newSearches.unshift(item);

                      AsyncStorage.setItem(
                        "recent-searches",
                        JSON.stringify(newSearches),
                      ).catch((err) => console.log(err));

                      return newSearches;
                    }

                    // Index not found so return previous searches
                    return prevSearches;
                  });

                  // Temporary to show results
                  setResults([item]);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 15,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: Colors.lightgray,
                      padding: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Ionicons name="ios-time" size={20} color={Colors.blue} />
                  </View>
                  <View style={{ rowGap: 3 }}>
                    <Text>{item.location}</Text>
                    <Text style={{ color: Colors.gray }}>{item.details}</Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                style={({ pressed }) => ({
                  ...pressedOpacity(pressed),
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                })}
                onPress={() => {
                  setRecentSearches((prevSearches) => {
                    const newSearches = prevSearches.filter(
                      (query) => query.id !== item.id,
                    );

                    if (newSearches.length === 0) {
                      AsyncStorage.removeItem("recent-searches").catch((err) =>
                        console.log(err),
                      );
                      return [];
                    }

                    AsyncStorage.setItem(
                      "recent-searches",
                      JSON.stringify(newSearches),
                    ).catch((err) => console.log(err));

                    return newSearches;
                  });
                }}
              >
                <Ionicons name="ios-close" size={20} color={Colors.blue} />
              </Pressable>
            </View>
          )}
        />
      </>
    );
  };

  const renderResults = () => {
    return (
      <>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            paddingHorizontal: 5,
            paddingTop: 20,
            paddingBottom: 5,
          }}
        >
          Results
        </Text>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                columnGap: 10,
                marginHorizontal: 5,
                ...globalStyles.bottomGapSmall,
              }}
            >
              <Pressable
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  ...pressedOpacity(pressed),
                })}
                onPress={() => {
                  navigation.navigate({
                    name: Routes.FILTER,
                    params: { destination: item.location },
                    merge: true,
                  });
                }}
              >
                <View style={{ rowGap: 3 }}>
                  <Text>{item.location}</Text>
                  <Text style={{ color: Colors.gray }}>{item.details}</Text>
                </View>
              </Pressable>
            </View>
          )}
        />
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} horizontal={false}>
      <FormInput
        type="clearable"
        value={searchQuery}
        onChangeText={(value) => {
          if (!value && results.length > 0) {
            setResults([]);
          }
          setSearchQuery(value);
        }}
        placeholder="Where To?"
        returnKeyType="search"
        onClear={() => {
          setSearchQuery("");
          setResults([]);
        }}
        onSubmitEditing={() => {
          if (!searchQuery) {
            navigation.navigate({
              name: Routes.FILTER,
              params: { destination: "" },
              merge: true,
            });
            return;
          }

          const newSearch = {
            id: Math.random(),
            location: searchQuery,
            // If it really needs this, just pass as params in route
            details: "Nov 29 - 30 (3 Adults)",
          };

          setRecentSearches((prevSearches) => {
            const newSearches = [newSearch, ...prevSearches];

            AsyncStorage.setItem(
              "recent-searches",
              JSON.stringify(newSearches),
            ).catch((err) => console.log(err));

            return newSearches;
          });

          // Temporary to show results
          setResults([newSearch]);
        }}
      />
      <ScrollView
        horizontal
        scrollEnabled={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flexGrow: 1 }}>
          {recentSearches.length > 0 &&
            results.length === 0 &&
            renderRecentSearches()}

          {results.length > 0 && renderResults()}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

export default Search;
