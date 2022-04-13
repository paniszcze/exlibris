import { Link } from "react-router-dom";

import "./BookList.css";

export default function BookList({ books }) {
  return (
    <div className="book-list">
      {books.length === 0 && <p>Brak książek do wyświetlenia</p>}
      {books.map((book) => (
        <Link to={`/books/${book.id}`} key={book.id}>
          <h4>{book.entryDetails.title}</h4>
          <p>{book.entryDetails.authors.map((author) => author.name)}</p>
        </Link>
      ))}
    </div>
  );
}
