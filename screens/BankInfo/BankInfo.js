import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useReducer, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useToast } from "react-native-toast-notifications";

import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import FormPicker from "../../components/FormPicker/FormPicker";
import mappingsData from "../../data/mappingsData";
import { Routes } from "../../navigation/Routes";
import { addPayoutMethod } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import isBirthdayValid from "../../utils/birthdayValidator";
import clearErrorWhenNotEmpty from "../../utils/clearEmptyInput";
import reducerSetter from "../../utils/reducerSetter";
import style from "../GuestInfo/GuestInfoStyles";

const initialState = {
  accountName: "",
  accountNumber: "",
  role: "",
  bankName: "",
  bankType: "",
  swiftCode: "",
  bankCode: "",
  email: "",
  phone: "",
  dob: "",
  pob: "",
  citizenship: "",
  billingCountry: "",
};

const roleData = [
  { label: "Property Owner", value: "property_owner" },
  { label: "Property Manager", value: "property_manager" },
  { label: "Hosting Service Provider", value: "hosting_service_provider" },
  { label: "Other", value: "other" },
];

const bankTypeData = [
  { label: "Personal", value: "personal" },
  { label: "Joint", value: "joint" },
  { label: "Business", value: "business" },
];

const BankInfo = ({ navigation }) => {
  const [bankState, setBankData] = useReducer(
    reducerSetter,
    initialState,
    undefined,
  );
  const [errors, setErrors] = useState(null);

  const {
    accountName,
    accountNumber,
    role,
    bankName,
    bankType,
    swiftCode,
    bankCode,
    email,
    phone,
    dob,
    pob,
    citizenship,
    billingCountry,
  } = bankState;

  const accountNumberRef = useRef(null);
  const bankNameRef = useRef(null);
  const swiftCodeRef = useRef(null);
  const bankCodeRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const dobRef = useRef(null);
  const pobRef = useRef(null);
  const citizenshipRef = useRef(null);
  const billingCountryRef = useRef(null);

  const queryClient = useQueryClient();
  const toast = useToast();

  const addPayoutMethodMutation = useMutation({
    mutationFn: addPayoutMethod,
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onError: (e) => {
          setErrors(e.errors);
        },
        onSuccess: (res) => {
          queryClient
            .invalidateQueries({ queryKey: ["payoutMethods"] })
            .then(() => console.log("Payout methods invalidated"));

          toast.hideAll();

          toast.show(res.message, {
            type: "success",
            style: toastStyles.toastInsetFooter,
          });

          navigation.navigate(Routes.FEEDBACK, {
            type: "success",
            title: "Congratulations",
            subtitle: "Payout Method Added Successfully",
            screenToNavigate: Routes.PAYOUTS,
          });
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        handleErrors: (e) => {
          setErrors(e.errors);
        },
      }),
  });

  const handleAddPayoutMethod = useCallback(() => {
    if (addPayoutMethodMutation.isPending) {
      return;
    }

    const bankData = Object.entries(mappingsData).reduce(
      (acc, [state, userDataKey]) => {
        acc[userDataKey] = bankState[state];
        return acc;
      },
      {}, // initial value
    );

    addPayoutMethodMutation.mutate({
      payoutData: {
        type: "card",
        ...bankData,
      },
    });
  }, [addPayoutMethodMutation.isPending, bankState]);

  const onDobError = useCallback(() => {
    setBankData({ dob: "" });
    setErrors((prev) => ({
      ...prev,
      [mappingsData.dob]: ["You must be 18 years old or above."],
    }));
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={80}
        style={globalStyles.flexFull}
      >
        <ScrollView
          contentInset={{ top: 10, bottom: 35 }}
          contentContainerStyle={style.contentContainer}
        >
          <Text style={globalStyles.smallHeaderText}>Your Bank Details</Text>

          <FormInput
            value={accountName}
            onChangeText={(value) => {
              setBankData({ accountName: value });
              clearErrorWhenNotEmpty(
                value,
                mappingsData.accountName,
                setErrors,
              );
            }}
            placeholder="Account Name"
            textContentType="name"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => {
              accountNumberRef.current.focus();
            }}
            errorMessage={errors?.[mappingsData.accountName]}
          />
          <FormInput
            value={accountNumber}
            onChangeText={(value) => {
              setBankData({ accountNumber: value });
              clearErrorWhenNotEmpty(
                value,
                mappingsData.accountNumber,
                setErrors,
              );
            }}
            placeholder="Account Number"
            keyboardType="number-pad"
            autoCorrect={false}
            returnKeyType="next"
            ref={accountNumberRef}
            errorMessage={errors?.[mappingsData.accountNumber]}
          />
          <FormPicker
            placeholder="Role"
            data={roleData}
            value={role}
            onSelected={(value) => {
              setBankData({ role: value });
              clearErrorWhenNotEmpty(value, mappingsData.role, setErrors);
            }}
            errorMessage={errors?.[mappingsData.role]}
          />
          <FormInput
            value={bankName}
            onChangeText={(value) => {
              setBankData({ bankName: value });
              clearErrorWhenNotEmpty(value, mappingsData.bankName, setErrors);
            }}
            placeholder="Bank Name"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            ref={bankNameRef}
            errorMessage={errors?.[mappingsData.bankName]}
          />
          <FormPicker
            placeholder="Bank Type"
            data={bankTypeData}
            value={bankType}
            onSelected={(value) => {
              setBankData({ bankType: value });
              clearErrorWhenNotEmpty(value, mappingsData.bankType, setErrors);
            }}
            errorMessage={errors?.[mappingsData.bankType]}
          />
          <FormInput
            value={swiftCode}
            onChangeText={(value) => {
              setBankData({ swiftCode: value });
              clearErrorWhenNotEmpty(value, mappingsData.swiftCode, setErrors);
            }}
            placeholder="SWIFT Code"
            autoCorrect={false}
            returnKeyType="next"
            ref={swiftCodeRef}
            onSubmitEditing={() => {
              bankCodeRef.current.focus();
            }}
            errorMessage={errors?.[mappingsData.swiftCode]}
          />
          <FormInput
            value={bankCode}
            onChangeText={(value) => {
              setBankData({ bankCode: value });
              clearErrorWhenNotEmpty(value, mappingsData.bankCode, setErrors);
            }}
            placeholder="Bank Code"
            autoCorrect={false}
            returnKeyType="next"
            ref={bankCodeRef}
            onSubmitEditing={() => {
              emailRef.current.focus();
            }}
            errorMessage={errors?.[mappingsData.bankCode]}
          />
          <FormInput
            value={email}
            onChangeText={(value) => {
              setBankData({ email: value });
              clearErrorWhenNotEmpty(value, mappingsData.email, setErrors);
            }}
            placeholder="Email Address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => {
              phoneRef.current.focus();
            }}
            errorMessage={errors?.[mappingsData.email]}
            ref={emailRef}
          />
          <FormInput
            value={phone}
            onChangeText={(value) => {
              setBankData({ phone: value });
              clearErrorWhenNotEmpty(value, mappingsData.phone, setErrors);
            }}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            onFocus={() => {
              // Add phone number prefix if empty
              if (!phone) {
                setBankData({ phone: "+63" });
              }
            }}
            onSubmitEditing={() => {
              dobRef.current.focus();
            }}
            maxLength={13}
            autoCorrect={false}
            errorMessage={errors?.[mappingsData.phone]}
            ref={phoneRef}
          />
          <FormInput
            type="date"
            value={dob}
            onChangeText={(value) => {
              setBankData({ dob: value });
              clearErrorWhenNotEmpty(value, mappingsData.dob, setErrors);
            }}
            onDateConfirm={(_, text) => {
              if (isBirthdayValid(text, onDobError)) {
                setBankData({ dob: text });
                clearErrorWhenNotEmpty(text, mappingsData.dob, setErrors);
              }
            }}
            dateProps={{ maximumDate: new Date() }}
            placeholder="Date of Birth (MM/DD/YYYY)"
            textContentType="none"
            keyboardType="number-pad"
            autoCorrect={false}
            spellCheck={false}
            errorMessage={errors?.[mappingsData.dob]}
            returnKeyType="next"
            onBlur={() => isBirthdayValid(dob, onDobError)}
            onSubmitEditing={() => {
              pobRef.current.focus();
            }}
            submitBehavior="submit"
            ref={dobRef}
          />
          <FormInput
            value={pob}
            onChangeText={(value) => {
              setBankData({ pob: value });
              clearErrorWhenNotEmpty(value, mappingsData.pob, setErrors);
            }}
            placeholder="Place of Birth"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => {
              citizenshipRef.current.focus();
            }}
            errorMessage={errors?.[mappingsData.pob]}
            ref={pobRef}
          />
          <FormInput
            value={citizenship}
            onChangeText={(value) => {
              setBankData({ citizenship: value });
              clearErrorWhenNotEmpty(
                value,
                mappingsData.citizenship,
                setErrors,
              );
            }}
            placeholder="Citizenship"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => {
              billingCountryRef.current.focus();
            }}
            errorMessage={errors?.[mappingsData.citizenship]}
            ref={citizenshipRef}
          />
          <FormInput
            value={billingCountry}
            onChangeText={(value) => {
              setBankData({ billingCountry: value });
              clearErrorWhenNotEmpty(
                value,
                mappingsData.billingCountry,
                setErrors,
              );
            }}
            placeholder="Billing Country"
            autoCorrect={false}
            returnKeyType="next"
            errorMessage={errors?.[mappingsData.billingCountry]}
            ref={billingCountryRef}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <AppFooter>
        <ButtonLarge onPress={handleAddPayoutMethod}>Continue</ButtonLarge>
      </AppFooter>

      <DialogLoading visible={addPayoutMethodMutation.isPending} />
    </>
  );
};

export default BankInfo;
