// Import the createIconSetFromFontello method
import { createIconSetFromFontello } from "@expo/vector-icons";

// Import the config file
import fontelloConfig from "./config.json";

// Both the font name and files exported from Fontello are most likely called "fontello"
const Icon = createIconSetFromFontello(
  fontelloConfig,
  "Fontello",
  "Fontello.ttf",
);

export default Icon;
