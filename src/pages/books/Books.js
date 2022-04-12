import { useCollection } from "../../hooks/useCollection";

import BookList from "./BookList";

export default function Books() {
  const { documents: books } = useCollection("books");

  return (
    <div>
      <h2 className="page-title">Moje książki</h2>
      {books && <BookList books={books} />}
    </div>
  );
}
