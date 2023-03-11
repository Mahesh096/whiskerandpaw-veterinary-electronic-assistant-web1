export default (dateString) => {
  // add 'Z' to the end of UTC dates if it's missing
  let UTCDate = dateString;
  if (UTCDate) {
    if (UTCDate.charAt(UTCDate.length - 1) !== 'Z')
      UTCDate = UTCDate.concat('Z');
    return `${new Date(UTCDate).toDateString()} ${new Date(
      UTCDate,
    ).toLocaleTimeString()}`;
  }
};
export const convertUnixDate = (timestamp) =>
  `${new Date(timestamp).toDateString()}`;

export const convertUnixTime = (timestamp) =>
  `${new Date(timestamp).toLocaleTimeString()}`;
