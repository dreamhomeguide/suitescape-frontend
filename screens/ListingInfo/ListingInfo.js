import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import style from "../../assets/styles/createListingStyles";
import globalStyles from "../../assets/styles/globalStyles";
import FormInput from "../../components/FormInput/FormInput";
import { useCreateListingContext } from "../../contexts/CreateListingContext";

const ListingInfo = () => {
  const { listingState, setListingData } = useCreateListingContext();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={80}
      style={globalStyles.flexFull}
    >
      <ScrollView
        contentInset={{ top: 10, bottom: 35 }}
        contentContainerStyle={style.contentContainer}
      >
        <View>
          <Text style={globalStyles.smallHeaderText}>Name of your listing</Text>
          <Text>
            Kindly provide the name you wish to assign to your listing, as it
            will be set as the title for your listing. It's important to note
            that once submitted, this title cannot be altered, so please choose
            it carefully to accurately reflect the content.
          </Text>
        </View>

        <FormInput
          placeholder="Enter the name of your listing"
          value={listingState.name}
          onChangeText={(value) => setListingData({ name: value })}
          maxLength={100}
          showCharCounter
        />

        <View>
          <Text style={globalStyles.smallHeaderText}>
            Description (Optional)
          </Text>
          <Text>
            Describe your listing to give potential guests a preview of what
            they can expect. This description will appear on your listing page
            and helps highlight the features and appeal of your place.
          </Text>
        </View>

        <FormInput
          type="textarea"
          placeholder="Tell us about your listing"
          value={listingState.description}
          onChangeText={(value) => setListingData({ description: value })}
          maxLength={5000}
          showCharCounter
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ListingInfo;
