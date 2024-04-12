import React, { useEffect, useMemo } from "react";
import { View } from "react-native";

import style from "./PasswordCheckerStyles";
import PasswordCriteriaRow from "../PasswordCriteriaRow/PasswordCriteriaRow";

const REQUIRED_SIZE = 5;

const PasswordCheckerView = ({ password, setIsPasswordValid, onLayout }) => {
  const criteria = useMemo(() => {
    return {
      hasMinimumLength: password.length >= 8,
      hasCapitalLetter: /[A-Z]/.test(password),
      hasLowerCaseLetter: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialCharacter: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(
        password,
      ),
    };
  }, [password]);

  const criteriaMetCount = Object.values(criteria).filter(Boolean).length;

  useEffect(() => {
    if (setIsPasswordValid) {
      setIsPasswordValid(criteriaMetCount === REQUIRED_SIZE);
    }
  }, [criteriaMetCount, setIsPasswordValid]);

  return (
    <View style={style.mainContainer} onLayout={onLayout}>
      <PasswordCriteriaRow
        met={criteria.hasMinimumLength}
        text="Minimum of 8 characters"
      />
      <PasswordCriteriaRow
        met={criteria.hasCapitalLetter}
        text="Must have at least 1 capital letter"
      />
      <PasswordCriteriaRow
        met={criteria.hasLowerCaseLetter}
        text="Must have at least 1 lowercase letter"
      />
      <PasswordCriteriaRow
        met={criteria.hasNumber}
        text="Must have at least 1 number"
      />
      <PasswordCriteriaRow
        met={criteria.hasSpecialCharacter}
        text="Must have at least 1 special character"
      />
    </View>
  );
};

export default PasswordCheckerView;
