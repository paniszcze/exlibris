import { Link } from "react-router-dom";

import "./BookList.css";

export default function BookList({ books }) {
  return (
    <>
      {books.length === 0 ? (
        <p className="info">Brak książek do wyświetlenia</p>
      ) : (
        <div className="book-list">
          {books.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id}>
              <h4>{book.entryDetails.title}</h4>
              {book.entryDetails.authors.length > 0 && (
                <p>
                  {book.entryDetails.authors.map((author) => author).join(", ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
