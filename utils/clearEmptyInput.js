const clearErrorWhenNotEmpty = (value, key, setErrors) => {
  if (value) {
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  }
};

export default clearErrorWhenNotEmpty;
