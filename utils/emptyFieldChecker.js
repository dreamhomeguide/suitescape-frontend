const EMPTY_FIELDS = new Set(["", null, undefined, -1]);

export const checkEmptyFieldsObj = (
  fields,
  excludedArr = null,
  all = false,
) => {
  // Convert excludedArr to Set for faster lookup
  excludedArr = new Set(excludedArr);

  // Check if all fields are empty
  if (all) {
    return Object.entries(fields).every(([key, value]) => {
      return excludedArr.has(key) || EMPTY_FIELDS.has(value);
    });
  }

  // Check if any field is empty
  return Object.entries(fields).some(([key, value]) => {
    return !excludedArr.has(key) && EMPTY_FIELDS.has(value);
  });
};

export const isEmptyField = (value) => {
  return EMPTY_FIELDS.has(value);
};

export const fillEmptyFieldsObj = (fields, fillValue) => {
  return Object.keys(fields).reduce((acc, key) => {
    acc[key] = fillValue;
    return acc;
  }, {});
};
