function formatPhoneNumber(numbers) {
  if (Array.isArray(numbers)) numbers = numbers.join(''); // Convert array to string of numbers
  return (
    '(' +
    numbers?.substring(1, 4) +
    ') ' +
    numbers?.substring(3, 6) +
    '-' +
    numbers?.substring(6)
  );
}

export default formatPhoneNumber;
