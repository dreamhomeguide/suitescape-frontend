import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Image } from "react-native";

export const cacheAssetsAsync = ({ images = [], fonts = [], videos = [] }) => {
  return Promise.all([
    ...cacheImages(images),
    ...cacheFonts(fonts),
    ...cacheVideos(videos),
  ]);
};

export const cacheImages = (images) => {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

export const cacheVideos = (videos) => {
  return videos.map((video) => Asset.fromModule(video).downloadAsync());
};

export const cacheFonts = (fonts) => {
  return fonts.map((font) => Font.loadAsync(font));
};
