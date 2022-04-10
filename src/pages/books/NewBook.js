import { useState } from "react";

import "./Books.css";

export default function NewBook() {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    console.log(title, authors);
  };

  return (
    <div className="book-form">
      <h2 className="page-title">Dodaj książkę</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Tytuł:</span>
          <input
            required
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label>
          <span>Autor:</span>
          <input
            required
            type="text"
            onChange={(author) => setAuthors(author)}
          />
        </label>

        <button className="btn">Dodaj książkę</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
