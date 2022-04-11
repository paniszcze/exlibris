const translateMonth = (month) => {
  switch (month) {
    case "Jan":
      return "stycznia";
    case "Feb":
      return "lutego";
    case "Mar":
      return "marca";
    case "Apr":
      return "kwietnia";
    case "May":
      return "maja";
    case "Jun":
      return "czerwca";
    case "Jul":
      return "lipca";
    case "Aug":
      return "sierpnia";
    case "Sep":
      return "września";
    case "Oct":
      return "października";
    case "Nov":
      return "listopada";
    case "Dec":
      return "grudnia";
    default:
      return month;
  }
};

export function translateDate(date) {
  const dateElements = date.split(" ");

  let day = dateElements[2].replace(/^0+/, "");
  let month = translateMonth(dateElements[1]);
  let year = dateElements[3];
  let hour = dateElements[4].slice(0, 5).replace(/^0+/, "");

  return `${day} ${month} ${year}, ${hour}`;
}
