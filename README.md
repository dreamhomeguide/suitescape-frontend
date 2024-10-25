# How to upload to Google Play Store
1. `npx expo prebuild -p android --clean` (This will create the android folder)
2. `eas build --platform android --profile production` (This will create the .aab file to upload to Google Play Store)
3. `eas submit -p android` (This will upload the .aab file to Google Play Store)
