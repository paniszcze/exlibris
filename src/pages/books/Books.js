import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

import "./Books.css";

import BookList from "./BookList";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Books() {
  const { user } = useAuthContext();
  const { document: indexList } = useDocument("index", user.uid);

  return (
    <div className="books">
      <h2 className="page-title">Moje książki</h2>
      {indexList ? (
        Object.keys(indexList.books).length === 0 ? (
          <p className="info">Brak książek do wyświetlenia</p>
        ) : (
          <BookList
            books={Object.values(indexList.books).sort((a, b) =>
              new Intl.Collator("pl", { ignorePunctuation: true }).compare(
                a.title,
                b.title
              )
            )}
          />
        )
      ) : (
        <LoadingSpinner />
      )}
      <Link to="new" className="btn">
        Dodaj nową książkę
      </Link>
    </div>
  );
}
