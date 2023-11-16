import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import SuitescapeAPI from "../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../utilities/apiHelpers";

const useFetchAPI = (endpoint, config, initialData) => {
  const [data, setData] = useState(initialData);

  const queryClient = useQueryClient();

  const fetchKey = endpoint.split("/").filter((e) => e);

  const fetchAPI = async ({ signal }) => {
    return await SuitescapeAPI.get(endpoint, { ...config, signal });
  };

  const query = useQuery({
    queryKey: fetchKey,
    queryFn: fetchAPI,
  });

  const abort = () => {
    queryClient.cancelQueries({ queryKey: fetchKey }).catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    if (query.isError) {
      handleApiError({
        error: query.error,
        defaultAlert: true,
      });
      return;
    }

    if (query.data) {
      handleApiResponse({
        response: query.data,
        onSuccess: (result) => setData(result),
      });
    }
  }, [query.data, query.isError]);

  return { ...query, data, abort };
};

export default useFetchAPI;
