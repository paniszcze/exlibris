import { Link } from "react-router-dom";

import "./BookList.css";

export default function BookList({ books }) {
  return (
    <>
      {books.length === 0 ? (
        <p className="info">Brak książek do wyświetlenia</p>
      ) : (
        <div className="book-list">
          {[...books]
            .sort((a, b) =>
              new Intl.Collator("pl", { ignorePunctuation: true }).compare(
                a.title,
                b.title
              )
            )
            .map((book) => (
              <Link to={`/books/${book.id}`} key={book.id}>
                <h4>{book.title}</h4>
                {book.authors.length > 0 && (
                  <p>{book.authors.map((author) => author).join(", ")}</p>
                )}
              </Link>
            ))}
        </div>
      )}
    </>
  );
}
