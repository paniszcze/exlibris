import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";

import "./Books.css";

import BookList from "./BookList";

export default function Books() {
  const { documents: books } = useCollection("books");

  if (!books) {
    return <p className="info">Wczytuję...</p>;
  }

  return (
    <div className="books">
      <h2 className="page-title">Moje książki</h2>
      {books && <BookList books={books} />}
      <Link to="new" className="btn">
        Dodaj nową książkę
      </Link>
    </div>
  );
}
