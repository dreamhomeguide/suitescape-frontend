const flattenErrors = (errors) => {
  return Object.entries(errors).reduce((acc, [key, value]) => {
    const splitKey = key.split(".");

    if (splitKey.length > 1) {
      acc[splitKey[1]] = value;
      return acc;
    }

    return acc;
  }, {});
};

export default flattenErrors;
