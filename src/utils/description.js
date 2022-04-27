export const unshiftLastName = (name) => {
  let words = name.split(" ");

  if (words.length === 1) {
    return words[0];
  }

  // EXCEPTION'1: <name> from <place>
  if (words.length === 3 && /^[zà]$/.test(words[1])) {
    return words.join(" ");
  }

  let lastName = words.pop();

  // EXCEPTION'2: Ursula K. Le Guin
  if (lastName === "Guin" && /^le$/i.test(words[words.length - 1])) {
    lastName = `${words.pop()} ${lastName}`;
  }

  const elision = new RegExp(/^(d'|l')/, "i");
  if (elision.test(lastName)) {
    words.push(lastName.substring(0, 2));
    lastName = lastName.substring(2);
  }
  return `${lastName}, ${words.join(" ")}`;
};

export const shiftLastName = (name) => {
  let words = name.split(", ");
  if (words.length === 1) {
    return words[0];
  }

  let lastName = words.shift();
  const elision = new RegExp(/^(d'|l')/, "i");
  return `${words.join(" ")}${
    elision.test(words[words.length - 1]) ? "" : " "
  }${lastName}`;
};

export const createDescription = (entry) => {
  const description = [];

  // authors if they exist, otherwise editors
  if (entry.authors.length > 0) {
    description.push(
      entry.authors.map((author) => unshiftLastName(author)).join("; ") + ":"
    );
  } else if (entry.editors.length > 0) {
    description.push(
      entry.editors.map((editor) => unshiftLastName(editor)).join("; ") +
        " [red.]:"
    );
  }
  // title, subtitle and volume
  description.push(entry.title + (/[.?!]$/.test(entry.title) ? "" : "."));
  if (entry.subtitle) {
    description.push(
      entry.subtitle + (/[.?!]$/.test(entry.subtitle) ? "" : ".")
    );
  }
  if (entry.volume) {
    description.push("T. " + entry.volume + ".");
  }
  // editors if authors exist
  if (entry.authors.length > 0 && entry.editors.length > 0) {
    description.push("— red. " + entry.editors.join(", "));
  }
  // edition
  if (entry.edition) {
    description.push(`— wyd. ${entry.edition}`);
  }
  // translators
  if (entry.translators.length > 0) {
    description.push("— przeł. " + entry.translators.join(", ") + ".");
  }
  // place and year
  if (entry.place && entry.year) {
    description.push(`— ${entry.place}, ${entry.year}`);
  } else if (entry.place || entry.year) {
    description.push(`— ${entry.place ? entry.place : entry.year}`);
  }
  // publisher, series and print run
  if (entry.publisher || entry.series.length > 0 || entry.printRun) {
    let items = [];
    if (entry.publisher) {
      items.push(entry.publisher);
    }
    if (entry.series.length > 0) {
      items.push(entry.series.join(", "));
    }
    if (entry.printRun) {
      items.push("n. " + entry.printRun);
    }
    description.push(`[${items.join(", ")}]`);
  }
  // info
  if (entry.info) {
    description.push(`{${entry.info}}`);
  }

  return description.join(" ");
};
