import React, { useCallback } from "react";
import { FlatList } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import ProfileItem from "../../components/ProfileItem/ProfileItem";
import useFetchAPI from "../../hooks/useFetchAPI";

const Saved = () => {
  const { data: saved } = useFetchAPI(`/profile/saved`);

  const renderItem = useCallback(({ item }) => <ProfileItem item={item} />, []);

  return (
    <FlatList
      data={saved}
      numColumns={2}
      contentContainerStyle={globalStyles.uniformGap}
      columnWrapperStyle={globalStyles.uniformGap}
      renderItem={renderItem}
    />
  );
};

export default Saved;
