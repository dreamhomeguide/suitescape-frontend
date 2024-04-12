import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useVideoFilters } from "../contexts/VideoFiltersContext";
import { fetchVideos } from "../services/apiService";

const useFetchVideos = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { videoFilters } = useVideoFilters();
  // const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["videos", videoFilters],
    queryFn: ({ pageParam = "" }) => fetchVideos({ pageParam, videoFilters }),
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    select: (data) => {
      return data?.pages.map((page) => page.data).flat();
    },
    retry: false,
  });

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      // await queryClient.resetQueries({ queryKey: ["videos"] });
      await query.refetch();
    } catch (err) {
      console.log("Error refreshing videos:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return { ...query, isRefreshing, refresh };
};

export default useFetchVideos;
