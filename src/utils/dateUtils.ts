export function convertUnixTimestampToDate(timestamp: number) {
  return new Date(timestamp*1000);
}