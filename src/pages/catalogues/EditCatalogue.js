import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";

import { useFirestore } from "../../hooks/useFirestore";

import "./Catalogue.css";
import "./EditCatalogue.css";

export default function Catalogue() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { document: catalogue, error } = useDocument("catalogues", id);
  const { documents: catalogues } = useCollection("catalogues");
  const { updateDocument, deleteDocument, response } =
    useFirestore("catalogues");

  // populate input with current catalogue's props
  const [title, setTitle] = useState("");
  const [startingIndex, setStartingIndex] = useState(1);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (catalogue) {
      setTitle(catalogue.title);
      setStartingIndex(catalogue.startingIndex);
    }
  }, [catalogue]);

  // store restricted catalogue names
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    if (catalogues) {
      catalogues.forEach((item) => {
        if (item.title !== catalogue.title) {
          setTitles((prevState) => [...prevState, item.title]);
        }
      });
    }
    return () => setTitles([]);
  }, [catalogues, catalogue]);

  // button handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (titles.includes(title.trim())) {
      setFormError(`Masz już inny katalog o nazwie "${title.trim()}"`);
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

    const updates = {
      title: title.trim(),
      startingIndex: parsedNumber,
    };

    await updateDocument(id, updates);
    if (!response.error) {
      navigate(`/catalogues/${id}`);
    }
  };

  const toggleIsActive = async (id) => {
    await updateDocument(id, { isActive: !catalogue.isActive });
    if (!response.error) {
      navigate(`/catalogues/${id}`);
    }
  };

  const handleDelete = async (id) => {
    await deleteDocument(id);
    if (!response.error) {
      navigate("/catalogues");
    }
  };

  // display data fetching status
  if (error && !response.isPending) {
    return <div className="error">{error}</div>;
  }
  if (!catalogue) {
    return <div className="loading">Wczytywanie...</div>;
  }

  return (
    <div className="catalogue-form">
      <h2 className="page-title">Edytuj katalog</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Tytuł:</span>
          <input
            required
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            disabled={!catalogue.isActive}
          />
        </label>
        <label>
          <span>Rozpocznij indeksowanie od:</span>
          <input
            required
            type="number"
            onChange={(e) => setStartingIndex(e.target.value)}
            value={startingIndex}
            disabled={!catalogue.isActive}
          />
        </label>
        {formError && <p className="error">{formError}</p>}
        <div className="btn-container">
          <button type="submit" className="btn" disabled={!catalogue.isActive}>
            Zapisz zmiany
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => toggleIsActive(id)}
          >
            {catalogue.isActive ? "Archiwizuj katalog" : "Dearchiwizuj katalog"}
          </button>
          <button
            type="button"
            className="btn danger"
            onClick={() => handleDelete(id)}
          >
            Usuń katalog
          </button>
        </div>
      </form>
    </div>
  );
}
