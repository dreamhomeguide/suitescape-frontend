import { useQuery } from "@tanstack/react-query";

import { useSettings } from "../contexts/SettingsContext";
import { baseURL } from "../services/SuitescapeAPI";
import { fetchProfile } from "../services/apiService";

const useProfilePicture = () => {
  const { settings } = useSettings();

  const { data: userData } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !settings.guestModeEnabled,
  });

  let profilePicture;
  if (userData && userData.picture_url !== null) {
    profilePicture = { uri: baseURL + userData.picture_url };
  } else {
    profilePicture = require("../assets/images/pngs/default-profile.png");
  }

  return profilePicture;
};

export default useProfilePicture;
