import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useVideoFilter } from "../contexts/VideoFilterContext";
import SuitescapeAPI from "../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../utilities/apiHelpers";

const useFetchVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();
  const { videoFilter } = useVideoFilter();

  useEffect(() => {
    // if (filter) {
    //   queryClient.setQueryData(["videos"], {
    //     pages: [],
    //     pageParams: [],
    //   });
    // }
    if (videoFilter) {
      console.log(videoFilter);
    } else {
      console.log("No filters applied");
    }
  }, [videoFilter]);

  const fetchVideos = async ({ pageParam = 0 }) => {
    // const token = getAuthToken();
    console.log(`Fetching videos... (cursor: ${pageParam})`);

    const res = await SuitescapeAPI.get("/videos/feed?cursor=" + pageParam);
    console.log("AUTHORIZATION:", res.request._headers.authorization);
    return res.data;
  };

  const query = useInfiniteQuery({
    queryKey: ["videos"],
    queryFn: fetchVideos,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
  });

  useEffect(() => {
    if (query.isError) {
      handleApiError({ error: query.error, defaultAlert: true });
      return;
    }

    if (query.data) {
      handleApiResponse({
        response: query,
        onSuccess: (result) => {
          setVideos(result.pages.map((page) => page.data).flat());
        },
      });
    }
  }, [query.isError, query.data]);

  const refresh = async () => {
    setIsRefreshing(true);
    setVideos([]);
    try {
      await queryClient.resetQueries({ queryKey: ["videos"] });
      // await query.refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return { ...query, videos, isRefreshing, refresh };
};

export default useFetchVideos;
