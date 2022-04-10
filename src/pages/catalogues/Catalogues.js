import BookList from "../../components/BookList";

import "./Catalogues.css";

export default function Catalogues() {
  const books = null;

  return (
    <div>
      <h2 className="page-title">Moje katalogi</h2>
      {books && <BookList books={books} />}
    </div>
  );
}
