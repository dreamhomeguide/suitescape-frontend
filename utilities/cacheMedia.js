import * as FileSystem from "expo-file-system";

export const cacheDir = (subDir) => FileSystem.cacheDirectory + subDir;

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

export const clearCacheDir = async (subDir) => {
  console.log("Clearing cache…");
  await FileSystem.deleteAsync(cacheDir(subDir), { idempotent: true });
};
