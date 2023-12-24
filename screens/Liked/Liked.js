import React, { useCallback } from "react";
import { FlatList } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import ProfileItem from "../../components/ProfileItem/ProfileItem";
import useFetchAPI from "../../hooks/useFetchAPI";

const Liked = () => {
  const { data: liked } = useFetchAPI(`/profile/liked`);

  const renderItem = useCallback(({ item }) => <ProfileItem item={item} />, []);

  return (
    <FlatList
      data={liked}
      numColumns={2}
      contentContainerStyle={globalStyles.uniformGap}
      columnWrapperStyle={globalStyles.uniformGap}
      renderItem={renderItem}
    />
  );
};

export default Liked;
