import { useParams, Link } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";

import "./Catalogue.css";

export default function Catalogue() {
  const { id } = useParams();
  const { document: catalogue, error } = useDocument("catalogues", id);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!catalogue) {
    return <div className="loading">Wczytywanie...</div>;
  }

  return (
    <>
      <div className="catalogue">
        {catalogue && (
          <>
            <h2
              className={`page-title${catalogue.isActive ? "" : " archived"}`}
            >
              {catalogue.title}
            </h2>
            {catalogue.books.length > 0 ? (
              <ol start={catalogue.startingIndex}>
                {catalogue.books
                  .filter((book) => Boolean(book))
                  .sort((a, b) => {
                    if (a.description < b.description) {
                      return -1;
                    }
                    if (a.description > b.description) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((book) => (
                    <li
                      key={book.bookId}
                      className={book.isDisposed ? "disposed" : ""}
                    >
                      <Link to={`/books/${book.bookId}`}>
                        {book.description}
                      </Link>
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="info">Brak pozycji w katalogu</p>
            )}
          </>
        )}
      </div>
      <Link to="edit" className="btn">
        Edytuj katalog
      </Link>
    </>
  );
}
