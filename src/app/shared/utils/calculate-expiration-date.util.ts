export function calculateExpirationDate(): Date {
  const MILLISECONDS_IN_AN_HOUR = 60 * 60 * 1000;

  return new Date(new Date().getTime() + MILLISECONDS_IN_AN_HOUR);
}
