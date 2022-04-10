import { useParams } from "react-router-dom";

import "./Book.css";

import BookDetails from "./BookDetails";
import BookNotes from "./BookNotes";

export default function Book() {
  // const { id } = useParams();
  // const book = documents[id];

  return (
    <div className="book">
      {/* {book && (
        <>
          <BookDetails entry={book.entry} record={book.catalogue.record} />
          <BookNotes notes={book.notes} />
        </>
      )} */}
    </div>
  );
}
