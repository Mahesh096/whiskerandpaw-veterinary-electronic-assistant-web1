const currencyFormatter = (selectedCurrOpt) => (value) => {
  const locale = 'en-us';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: selectedCurrOpt,
  }).format(value);
};

export default currencyFormatter;
