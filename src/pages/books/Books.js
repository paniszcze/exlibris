import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

import "./Books.css";

import BookList from "./BookList";

export default function Books() {
  const { user } = useAuthContext();
  const { document: indexList } = useDocument("index", user.uid);

  const [books, setBooks] = useState([]);
  useEffect(() => {
    if (indexList) {
      for (const key in indexList.books) {
        setBooks((prevBooks) => [...prevBooks, indexList.books[key]]);
      }
    }
    return () => setBooks([]);
  }, [indexList]);

  return (
    <div className="books">
      <h2 className="page-title">Moje książki</h2>
      {indexList ? (
        <BookList books={books} />
      ) : (
        <p className="info">Wczytuję...</p>
      )}
      <Link to="new" className="btn">
        Dodaj nową książkę
      </Link>
    </div>
  );
}
