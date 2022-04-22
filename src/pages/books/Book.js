import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";

import "./Book.css";

import BookDetails from "./BookDetails";
import BookNotes from "./BookNotes";

export default function Book() {
  const { id } = useParams();
  const { document: book, error } = useDocument("books", id);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!book) {
    return <div className="loading">Wczytywanie...</div>;
  }

  return (
    <div className="book">
      <BookDetails entry={book.entryDetails} catalogue={book.catalogue} />
      <BookNotes notes={book.notes} bookId={id} />
    </div>
  );
}
