import * as FileSystem from "expo-file-system";
import { useCallback, useEffect, useState } from "react";

import { cacheDir, ensureDirExists } from "../utils/cacheMedia";

const MIN_CACHE_SIZE = 1000000; // 1 MB

const useCachedMedia = (subDir, fileName, downloadUrl, options) => {
  const [cacheState, setCacheState] = useState({
    cachedUri: downloadUrl,
    isCached: false,
  });

  useEffect(() => {
    const downloadAndCacheMedia = async () => {
      await ensureDirExists(subDir);

      // Get cache file
      const fileUri = cacheDir(subDir) + fileName;

      // Check if cache file already exists
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        // Download and cache media
        const { uri } = await FileSystem.downloadAsync(
          downloadUrl,
          fileUri,
          options,
        );

        // Get file size
        const { size } = await FileSystem.getInfoAsync(uri);

        // Check if file size is greater than 1 mb
        if (size < MIN_CACHE_SIZE) {
          console.log("Downloaded file is less than 1 MB. Aborting cache...");
          await FileSystem.deleteAsync(uri);
          return;
        }

        console.log("Finished downloading cache to", uri);
        setCacheState({ cachedUri: uri, isCached: true });
      } else {
        console.log(fileName + " is already cached locally");
        setCacheState({ cachedUri: fileUri, isCached: true });
      }
    };

    downloadAndCacheMedia().catch((err) => {
      console.log("Cache download aborted due to an error: ", err);
    });
  }, []);

  const clearCache = useCallback(async () => {
    // Get cache file
    const fileUri = cacheDir(subDir) + fileName;

    // Check if cache file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      console.log("Cache file does not exist");
    }

    // Delete cache file if it exists
    await FileSystem.deleteAsync(fileUri, { idempotent: true });

    setCacheState({ cachedUri: downloadUrl, isCached: false });
  }, []);

  return { ...cacheState, clearCache };
};

export default useCachedMedia;
