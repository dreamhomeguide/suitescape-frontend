import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import SuitescapeAPI from "../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../utilities/apiHelpers";

const useFetchVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const fetchVideos = async ({ pageParam = 0 }) => {
    // const token = getAuthToken();

    console.log("Fetching videos...", pageParam);
    const res = await SuitescapeAPI.get("/videos/feed?cursor=" + pageParam, {
      // FIXED: Workaround since auth doesn't seem to apply fast enough
      // headers: {
      //   Authorization: "Bearer " + token,
      // },
    });

    console.log("HEADERS:", res.request._headers);
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
