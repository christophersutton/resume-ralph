export const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (_) {
    return false;
  }
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
