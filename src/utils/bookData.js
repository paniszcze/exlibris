// BOOK DATA HELPERS

// Given previous and current entry details, function returns true
// if ANY of the props have changed, and false otherwise.
// This function helps determining whether book needs to be updated or not
// (i.e. prevents unnecessary writes).
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
  // Passing all checks means that the entry details haven't changed
  return false;
};

// Given previous and current entry details, function determines whether
// any of the creators of the book have changed, and returns an object
// with a "haveChanged" prop (true/false), and an array with all the changes
// that need to be included in the creators update (empty if none).
export const haveCreatorsChanged = (prev, curr) => {
  const result = { haveChanged: false, changes: [] };
  const creators = ["authors", "editors", "translators"];
  // List all previous creators without duplicates
  const prevCreators = [];
  creators.forEach((key) => {
    prev[key].forEach((person) => {
      if (prevCreators.indexOf(person) === -1) {
        prevCreators.push(person);
      }
    });
  });
  // List all current creators without duplicates
  const currCreators = [];
  creators.forEach((key) => {
    curr[key].forEach((person) => {
      if (currCreators.indexOf(person) === -1) {
        currCreators.push(person);
      }
    });
  });
  // Compare both arrays to list the differences
  let peopleToAdd = currCreators.filter(
    (person) => !prevCreators.includes(person)
  );
  let peopleToDelete = prevCreators.filter(
    (person) => !currCreators.includes(person)
  );
  // If no differences, return an object with "haveChanged" prop set to false.
  // Otherwise set the prop to true and continue
  if (peopleToAdd.length === 0 && peopleToDelete === 0) {
    return result;
  } else {
    result.haveChanged = true;
  }
  // Map the differences to an array
  if (peopleToAdd.length !== 0) {
    peopleToAdd.forEach((person) => result.changes.push([person, 1]));
  }
  if (peopleToDelete.length !== 0) {
    peopleToDelete.forEach((person) => result.changes.push([person, -1]));
  }
  // Return the object with "haveChanged" set to true and "changes"
  // listing all the updates that need to be done
  return result;
};
