import { Alert } from "react-native";

import capitalizedText from "./textCapitalizer";

export const handleApiResponse = ({ response, onError, onSuccess }) => {
  if (!response) {
    console.log("No response");
    return;
  }

  const result = response.data;

  if (result.errors) {
    errorAlert(result.message);
    onError && onError(result);
    console.log(result.errors);
    return;
  }

  onSuccess && onSuccess(result);
  // console.log(result);
};

export const handleApiError = ({
  error,
  handleErrors,
  defaultAlert = false,
}) => {
  if (!error) {
    console.log("No error");
    return;
  }

  const errorResponse = error.response;

  if (!errorResponse) {
    console.log(error.request);
    errorAlert(error.message);
    handleErrors && handleErrors(error);
    return;
  }

  const responseErrors = errorResponse.data;

  if (defaultAlert) {
    errorAlert(responseErrors.message);
  }

  handleErrors && handleErrors(responseErrors);
  console.log(responseErrors);
};

export const errorAlert = (message) => {
  Alert.alert("Error", capitalizedText(message));
};
