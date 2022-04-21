import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";

import "./NewCatalogue.css";
import "./EditCatalogue.css";

import Select from "react-select";
import { customStyles, customTheme } from "../../utils/select";

export default function EditCatalogue() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { id } = useParams();

  const { document: catalogue, error: catalogueError } = useDocument(
    "catalogues",
    id
  );
  const { document: userData } = useDocument("users", user.uid);
  const {
    updateDocument: updateCatalogue,
    deleteDocument,
    response,
  } = useFirestore("catalogues");
  const { updateDocument: updateUserData } = useFirestore("users");

  // react select options
  const sortingOptions = [
    { value: "description", label: "nazwisku autora" },
    { value: "title", label: "tytule książki" },
    { value: "createdAt", label: "kolejności dodawania" },
  ];

  // populate input with current catalogue's props
  const [title, setTitle] = useState("");
  const [startingIndex, setStartingIndex] = useState(1);
  const [sortBooksBy, setSortBooksBy] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (catalogue) {
      setTitle(catalogue.title);
      setStartingIndex(catalogue.startingIndex);
      setSortBooksBy(catalogue.sortBooksBy);
    }
  }, [catalogue]);

  // store restricted catalogue names
  const [catalogues, setCatalogues] = useState([]);
  const [restrictedTitles, setRestrictedTitles] = useState([]);

  useEffect(() => {
    if (userData) {
      setCatalogues([...userData.catalogues]);
      setRestrictedTitles(
        userData.catalogues.map((catalogue) => catalogue.title)
      );
    }
  }, [userData]);

  // button handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (restrictedTitles.includes(title.trim()) && title !== catalogue.title) {
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

    await updateCatalogue(id, {
      title: title.trim(),
      startingIndex: parsedNumber,
      sortBooksBy,
    });
    await updateUserData(user.uid, {
      catalogues: catalogues.map((item) =>
        item.id === id ? { ...item, title: title.trim() } : item
      ),
    });

    if (!response.error) {
      navigate(`/catalogues/${id}`);
    }
  };

  const toggleIsActive = async (id) => {
    const toggledValue = !catalogue.isActive;
    await updateCatalogue(id, { isActive: toggledValue });
    await updateUserData(user.uid, {
      catalogues: catalogues.map((item) =>
        item.id === id ? { ...item, isActive: toggledValue } : item
      ),
    });
    if (!response.error) {
      navigate(`/catalogues/${id}`);
    }
  };

  const handleDelete = async (id) => {
    if (catalogue.books.length !== 0) {
      setFormError(
        "Nie możesz usunąć katalogu, który nie jest pusty. Przenieś najpierw swoje książki do innego katalogu."
      );
      return;
    }

    await deleteDocument(id);
    await updateUserData(user.uid, {
      catalogues: catalogues.filter((item) => item.id !== id),
    });
    if (!response.error) {
      navigate("/catalogues");
    }
  };

  // display data fetching status
  if (catalogueError) {
    return <div className="error">{catalogueError}</div>;
  }
  if (!catalogue || !userData) {
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
        <label>
          <span>Sortuj pozycje w katalogu po:</span>
          <Select
            onChange={(option) => setSortBooksBy(option.value)}
            options={sortingOptions}
            defaultValue={{
              value: catalogue.sortBooksBy,
              label:
                catalogue.sortBooksBy === "description"
                  ? "nazwisku autora"
                  : catalogue.sortBooksBy === "title"
                  ? "tytule książki"
                  : "kolejności dodawania",
            }}
            isClearable={false}
            isDisabled={!catalogue.isActive}
            styles={customStyles}
            theme={customTheme}
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
