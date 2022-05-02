import { useParams, Link } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";

import "./Catalogue.css";

import LoadingSpinner from "../../components/LoadingSpinner";

export default function Catalogue() {
  const { id } = useParams();
  const { document: catalogue, error } = useDocument("catalogues", id);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!catalogue) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="catalogue">
        <h2 className={`page-title${catalogue.isActive ? "" : " archived"}`}>
          {catalogue.title}
        </h2>
        {catalogue.books.length > 0 ? (
          <ol start={catalogue.startingIndex}>
            {catalogue.books
              .sort((a, b) =>
                new Intl.Collator("pl").compare(
                  a[catalogue.sortBooksBy].toString(),
                  b[catalogue.sortBooksBy].toString()
                )
              )
              .map((book) => (
                <li key={book.id} className={book.isDisposed ? "disposed" : ""}>
                  <Link to={`/exlibris/books/${book.id}`}>{book.description}</Link>
                </li>
              ))}
          </ol>
        ) : (
          <p className="info">Brak pozycji w katalogu</p>
        )}
      </div>
      <Link to="edit" className="btn">
        Edytuj katalog
      </Link>
    </>
  );
}
