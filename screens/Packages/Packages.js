import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./PackagesStyles";
import globalStyles from "../../assets/styles/globalStyles";
import PackageItem from "../../components/PackageItem/PackageItem";
import { fetchAllPackages } from "../../services/apiService";

const Packages = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const {
    data: packages,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchAllPackages,
  });

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      console.log("Packages refetched");
    } catch (err) {
      console.log(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const renderItem = useCallback(({ item }) => <PackageItem item={item} />, []);

  return (
    <FlatList
      data={packages}
      renderItem={renderItem}
      contentContainerStyle={{
        ...style.contentContainer,
        paddingBottom: insets.bottom + StatusBar.currentHeight,
      }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={() =>
        isFetching && <ActivityIndicator style={globalStyles.loadingCircle} />
      }
    />
  );
};

export default Packages;
