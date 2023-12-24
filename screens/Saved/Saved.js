import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import ProfileItem from "../../components/ProfileItem/ProfileItem";
import useFetchAPI from "../../hooks/useFetchAPI";

const Saved = () => {
  const { data: saved, isFetched } = useFetchAPI(`/profile/saved`);

  const renderItem = useCallback(({ item }) => <ProfileItem item={item} />, []);

  const EmptyListComponent = useCallback(() => {
    return isFetched ? (
      <Text style={globalStyles.emptyTextCenter}>No saved listings.</Text>
    ) : (
      <ActivityIndicator style={globalStyles.loadingCircle} />
    );
  }, [isFetched]);

  return (
    <FlatList
      data={saved}
      numColumns={2}
      contentContainerStyle={globalStyles.uniformGap}
      columnWrapperStyle={globalStyles.uniformGap}
      renderItem={renderItem}
      ListEmptyComponent={EmptyListComponent}
    />
  );
};

export default Saved;
