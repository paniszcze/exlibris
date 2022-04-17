export const hasBookChanged = (prev, curr) => {
  // if catalogue's ID has changed, it means that the book has been reassigned
  // and it needs to be updated
  if (prev.catalogue.id !== curr.catalogue.id) {
    return true;
  }

  // divide book data keys by value type (string/array of strings)...
  const stringPropKeys = [];
  const arrayPropKeys = [];
  Object.keys(prev.entryDetails).forEach((key) =>
    typeof prev.entryDetails[key] === "string"
      ? stringPropKeys.push(key)
      : arrayPropKeys.push(key)
  );
  // ...to check if any of the book data props have changed
  // a) strings:
  if (
    stringPropKeys.some(
      (key) => prev.entryDetails[key] !== curr.entryDetails[key]
    )
  ) {
    return true;
  }
  // b) arrays of strings:
  if (
    arrayPropKeys.some(
      (key) =>
        curr.entryDetails[key].length !== prev.entryDetails[key].length ||
        !curr.entryDetails[key].every((item) =>
          prev.entryDetails[key].includes(item)
        )
    )
  ) {
    return true;
  }

  // otherwise there's no need for updating book data
  return false;
};
