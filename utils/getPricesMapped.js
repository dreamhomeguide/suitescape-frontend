import priceMappings from "../data/priceMappings";

const getPricesMapped = (type, data) => {
  const priceData = priceMappings[type];

  if (!data || !priceData) {
    return {
      weekdayPrice: 0,
      weekendPrice: 0,
    };
  }

  return {
    weekdayPrice: data[priceData.weekdayPrice],
    weekendPrice: data[priceData.weekendPrice],
  };
};

export default getPricesMapped;
