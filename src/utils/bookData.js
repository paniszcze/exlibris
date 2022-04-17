export const hasBookChanged = (prev, curr) => {
  // Divide book data keys by value type (string/array of strings)...
  const stringPropKeys = [];
  const arrayPropKeys = [];
  Object.keys(prev).forEach((key) =>
    typeof prev[key] === "string"
      ? stringPropKeys.push(key)
      : arrayPropKeys.push(key)
  );
  // ...to check if any of the props have changed:
  // a) strings
  if (stringPropKeys.some((key) => prev[key] !== curr[key])) {
    return true;
  }
  // b) arrays of strings
  if (
    arrayPropKeys.some(
      (key) =>
        curr[key].length !== prev[key].length ||
        !curr[key].every((item) => prev[key].includes(item))
    )
  ) {
    return true;
  }

  // otherwise there's no need for updating book data
  return false;
};
