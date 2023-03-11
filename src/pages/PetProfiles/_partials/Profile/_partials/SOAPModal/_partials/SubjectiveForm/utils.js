export const formatNumberToTwoDecimal = (num) => {
  if (num) {
    // Convert number to a string with 2 decimal places
    let str = Number(num).toFixed(2).toString();

    // If the whole number part of the string is more than 3 characters, truncate to 3 characters
    if (str.split('.')[0].length > 3) {
      str = str.slice(0, 3) + str.slice(-3);
    }

    return str;
  }
};

export const formatNumberToThreeNumber = (num) => {
  const integerPart = Math.floor(Number(num));
  if (num % 1 === 0 || integerPart.toString().length <= 3) {
    return integerPart.toString();
  } else {
    return integerPart.toString().substring(0, 3);
  }
};
