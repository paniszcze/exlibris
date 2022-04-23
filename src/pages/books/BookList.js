import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./BookList.css";

import Filter from "../../components/Filter";

import { createOption } from "../../utils/select";

export default function BookList({ books }) {
  // Map books to alphabet letters based on title's initial letter. Some
  // of the punctuation marks at the beggining are ignored (see regex below);
  // the rest and all remaining chars (numbers, symbols, etc.) are grouped
  // together at the end in a separate loop, so that the special key gets
  // displayed last later in the filter component.
  const [sortedBooks, setSortedBooks] = useState(null);
  useEffect(() => {
    const map = new Map();
    const special = [];

    books.forEach((book) => {
      if (/^[\p{Ps}\p{Pi}"]*\p{L}/u.test(book.title)) {
        let index = book.title.search(/\p{L}/u);
        return !map.has(book.title[index].toUpperCase())
          ? map.set(book.title[index].toUpperCase(), [book])
          : map.get(book.title[index].toUpperCase()).push(book);
      } else {
        special.push(book);
      }
    });

    if (special.length > 0) {
      special.forEach((book) =>
        !map.has("#") ? map.set("#", [book]) : map.get("#").push(book)
      );
    }

    setSortedBooks(map);
  }, [books]);

  // Once the books have been mapped to letters, create book filters based
  // on map's keys.
  const [bookFilters, setBookFilters] = useState([]);
  useEffect(() => {
    if (sortedBooks) {
      for (const key of sortedBooks.keys()) {
        setBookFilters((prevFilters) => [...prevFilters, createOption(key)]);
      }
    }
    return () => setBookFilters([]);
  }, [sortedBooks]);

  // Set current filter to the first filter from the list. Since this component
  // is rendered by its parent only if there are any books in user's db,
  // there will always be at least one filter available. However, a condition
  // in useEffect is still needed to prevent errors on initial renders
  // when previous useEffects take place.
  const [filter, setFilter] = useState("");
  useEffect(() => {
    if (bookFilters.length > 0) {
      setFilter(bookFilters[0].value);
    }
  }, [bookFilters]);

  return (
    <>
      <Filter
        currFilter={filter}
        changeFilter={setFilter}
        filters={bookFilters}
      />
      <div className="book-list">
        {sortedBooks &&
          filter &&
          sortedBooks.get(filter).map((book) => (
            <Link to={`/books/${book.id}`} key={book.id}>
              <h4>{book.title}</h4>
              {book.authors.length > 0 && (
                <p>{book.authors.map((author) => author).join(", ")}</p>
              )}
            </Link>
          ))}
      </div>
    </>
  );
}
