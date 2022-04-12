import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";

import { useFirestore } from "../../hooks/useFirestore";

import "./NewCatalogue.css";

export default function NewCatalogue() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { documents: catalogues } = useCollection("catalogues");
  const { addDocument, response } = useFirestore("catalogues");
  const [titles, setTitles] = useState([]);

  const [title, setTitle] = useState("");
  const [startingIndex, setStartingIndex] = useState(1);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (catalogues) {
      catalogues.map((catalogue) =>
        setTitles((prevState) => [...prevState, catalogue.title])
      );
    }

    return () => setTitles([]);
  }, [catalogues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (titles.includes(title.trim())) {
      setFormError(`Masz już katalog o nazwie "${title}"`);
      return;
    }
    let parsedNumber = parseInt(startingIndex);
    if (!parsedNumber) {
      setFormError("Podana wartość nie jest liczbą");
      return;
    }
    if (parsedNumber < 1) {
      setFormError(
        "Nie możesz rozpocząć indeksowania od liczby ujemnej lub zera"
      );
      return;
    }

    const createdBy = {
      displayName: user.displayName,
      id: user.uid,
    };

    const project = {
      title: title.trim(),
      createdBy,
      startingIndex: parsedNumber,
      isActive: true,
      books: [],
    };

    await addDocument(project);
    if (!response.error) {
      navigate("/catalogues");
    }
  };

  return (
    <div className="catalogue-form">
      <h2 className="page-title">Dodaj katalog</h2>
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
          <span>Rozpocznij indeksowanie od:</span>
          <input
            required
            type="number"
            onChange={(e) => setStartingIndex(e.target.value)}
            value={startingIndex}
          />
        </label>
        {formError && <p className="error">{formError}</p>}
        <button className="btn">Stwórz katalog</button>
      </form>
    </div>
  );
}
