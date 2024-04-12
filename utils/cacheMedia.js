import * as FileSystem from "expo-file-system";

export const cacheDir = (subDir) => FileSystem.cacheDirectory + (subDir ?? "");

export const ensureDirExists = async (subDir) => {
  // Get cache subdirectory
  const fileDirUri = cacheDir(subDir);

  // Check if cache subdirectory exists
  const dirInfo = await FileSystem.getInfoAsync(fileDirUri);

  if (!dirInfo.exists) {
    // console.log("Cache subdirectory doesn't exist, creating…");
    await FileSystem.makeDirectoryAsync(fileDirUri, { intermediates: true });
  }
};

export const cleanUpCache = async () => {
  const clearAllCache = async () => {
    const itemsPerBatch = 10;

    const cachedFiles = await FileSystem.readDirectoryAsync(
      FileSystem.cacheDirectory,
    );

    const batches = cachedFiles.reduce(
      (batches, value, index) =>
        index % itemsPerBatch
          ? batches
          : [...batches, cachedFiles.slice(index, index + itemsPerBatch)],
      [],
    );

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (file) => {
          await FileSystem.deleteAsync(cacheDir(file), { idempotent: true });
        }),
      );
    }

    console.log("Cache cleared!");
  };

  const cacheInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory);

  if (cacheInfo.size) {
    const cacheMB = cacheInfo.size / 1000000;

    // size limit of 500 MB
    const cacheStorageLimit = 500;

    if (cacheMB > cacheStorageLimit) {
      console.log("Cache size:", cacheMB, "MB, clearing…");
      await clearAllCache();
    }
    return;
  }

  if (cacheInfo.modificationTime) {
    const cacheAge = Date.now() - cacheInfo.modificationTime;

    // age limit of 1 day
    const cacheAgeLimit = 86400000;

    if (cacheAge > cacheAgeLimit) {
      console.log("Cache age:", cacheAge, "ms, clearing…");
      await clearAllCache();
    }
  }
};

// export const clearCacheDir = async (subDir) => {
//   await FileSystem.deleteAsync(cacheDir(subDir), { idempotent: true });
//   console.log("Cache cleared");
// };
