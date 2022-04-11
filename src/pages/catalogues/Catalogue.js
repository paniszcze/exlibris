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

  const handleClick = () => {
    console.log("Edytuj katalog");
  };

  const books = [...catalogue.books].sort((a, b) => {
    if (a.description < b.description) {
      return -1;
    }
    if (a.description > b.description) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <div className="catalogue">
        {catalogue && (
          <>
            <h2 className="page-title">{catalogue.title}</h2>
            <ol start={catalogue.startingIndex}>
              {books.map((book) => (
                <li
                  key={book.bookId}
                  className={book.isDisposed ? "disposed" : ""}
                >
                  <Link to={`/books/${book.bookId}`}>{book.description}</Link>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <button className="btn" onClick={handleClick}>
        Edytuj katalog
      </button>
    </>
  );
}
