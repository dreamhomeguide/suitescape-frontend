import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

import { cacheDir, ensureDirExists } from "../utilities/cacheMedia";

const useCachedMedia = (subDir, fileName, downloadUrl) => {
  const [cachedUri, setCachedUri] = useState(downloadUrl);

  useEffect(() => {
    (async () => {
      await ensureDirExists(subDir);

      // Get cache file
      const fileUri = cacheDir(subDir) + fileName;

      // Check if cache file already exists
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        // console.log("Media isn't cached locally. Downloading…");

        // No wait here, we want to return the downloadUrl immediately so users can play the video
        FileSystem.downloadAsync(downloadUrl, fileUri)
          .then(({ uri }) => {
            console.log("Finished downloading cache to", uri);
            setCachedUri(uri);
          })
          .catch(() => {
            console.log("Cache download aborted");
          });

        // Stream the video while cache is downloading
        setCachedUri(downloadUrl);
      }
    })();
  }, []);

  return { cachedUri };
};

export default useCachedMedia;
