export const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (_) {
    return false;
  }
};
