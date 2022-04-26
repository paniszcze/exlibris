export const searchFilters = [
  { label: "wszystko", value: "all" },
  { label: "twórcy", value: "author" },
  { label: "tytuły", value: "title" },
  { label: "serie", value: "series" },
  { label: "kategorie", value: "tag" },
  { label: "wydawcy", value: "publisher" },
];

export const cleanRegex = (query) =>
  new RegExp(
    `(${query.replace(/\\/g, "").replace(/[.*+^?|:=$!()[\]<>{}]/g, "\\$&")})`,
    "gi"
  );

export const highlightMatch = (text, query) => {
  const regex = cleanRegex(query);
  const dividedWord = text.split(regex).filter(Boolean);
  return (
    <>
      {dividedWord.map((division, i) => (
        <span key={i} className={regex.test(division) ? "match" : ""}>
          {division}
        </span>
      ))}
    </>
  );
};
