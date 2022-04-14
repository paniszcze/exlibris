export const decline = (word, count) => {
  switch (word) {
    case "książka":
      if (count === 1) {
        return "książkę";
      }
      if (
        (count % 10 === 2 || count % 10 === 3 || count % 10 === 4) &&
        !(count % 100 === 12 || count % 100 === 13 || count % 100 === 14)
      ) {
        return "książki";
      }
      return "książek";
    case "katalog":
      return count === 1 ? "katalogu" : "katalogach";
    default:
      return word;
  }
};
