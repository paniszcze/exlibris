import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";

import "./NewCatalogue.css";
import "./EditCatalogue.css";

import LoadingSpinner from "../../components/LoadingSpinner";
import Select from "react-select";
import { sortingOptions, customStyles, customTheme } from "../../utils/select";

export default function EditCatalogue() {
  // Context and router hooks
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { id } = useParams();

  // Firestore hooks
  // a) user data -> read/update existing catalogues
  const { document: userData } = useDocument("users", user.uid);
  const { updateDocument: updateUserData } = useFirestore("users");
  // b) catalogues -> read/update/delete current catalogue
  const { document: catalogue, error: catalogueError } = useDocument(
    "catalogues",
    id
  );
  const {
    updateDocument: updateCatalogue,
    deleteDocument,
    response,
  } = useFirestore("catalogues");
  // c) user's book index -> update
  const { updateDocument: updateIndex } = useFirestore("index");
  // d) books collection -> update books contained in catalogue
  const { updateDocument: updateBook } = useFirestore("books");

  // Catalogue form inputs. Note that the catalogue indexing (isIndexed)
  // is not allowed to be modified.
  const [title, setTitle] = useState("");
  const [startingIndex, setStartingIndex] = useState(1);
  const [sortBooksBy, setSortBooksBy] = useState("");

  // Populate input with current catalogue's props.
  useEffect(() => {
    if (catalogue) {
      setTitle(catalogue.title);
      setStartingIndex(catalogue.startingIndex);
      setSortBooksBy(catalogue.sortBooksBy);
    }
  }, [catalogue]);

  // Form managment
  const [formError, setFormError] = useState(null);
  const [restrictedTitles, setRestrictedTitles] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  useEffect(() => {
    if (userData) {
      setCatalogues([...userData.catalogues]);
      setRestrictedTitles(
        userData.catalogues.map((catalogue) => catalogue.title)
      );
    }
  }, [userData]);

  // BUTTON HANDLERS
  // A) submit catalogue update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Input validation
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

    // Update user data, index and books, only if catalogue's title has changed.
    const newTitle = title.trim();
    if (catalogue.title !== newTitle) {
      // 1) catalogue list in user data
      await updateUserData(user.uid, {
        catalogues: catalogues.map((item) =>
          item.id === id ? { ...item, title: newTitle } : item
        ),
      });
      // 2) books...
      const books = catalogue.books.map((book) => book.id);
      // 2a) ...in user's book index
      await updateIndex(
        user.uid,
        Object.fromEntries(
          books.map((bookId) => [`books.${bookId}.catalogue`, newTitle])
        )
      );
      // 2b) ...in firestore collection
      books.forEach(async (bookId) => {
        await updateBook(bookId, { "catalogue.title": newTitle });
      });
    }

    // Update current catalogue document
    await updateCatalogue(id, {
      title: title.trim(),
      startingIndex: parsedNumber,
      sortBooksBy,
    });

    if (!response.error) {
      navigate(`/exlibris/catalogues/${id}`);
    }
  };

  // B) archive catalogue
  const toggleIsActive = async (id) => {
    const currActive = !catalogue.isActive;
    // update current catalogue document
    await updateCatalogue(id, { isActive: currActive });
    // update catalogues list in user data
    await updateUserData(user.uid, {
      catalogues: catalogues.map((item) =>
        item.id === id ? { ...item, isActive: currActive } : item
      ),
    });
    // If the catalogue is indexed, assign (when archiving) or remove (when
    // de-archiving) a record number to contained books...
    if (catalogue.isIndexed) {
      const books = catalogue.books
        .sort((a, b) =>
          new Intl.Collator("pl").compare(
            a[catalogue.sortBooksBy].toString(),
            b[catalogue.sortBooksBy].toString()
          )
        )
        .map((book) => book.id);
      // ...in user's book index...
      await updateIndex(
        user.uid,
        Object.fromEntries(
          books.map((bookId, index) => [
            `books.${bookId}.record`,
            currActive
              ? ""
              : `${catalogue.title.slice(0, 5)}/${startingIndex + index}`,
          ])
        )
      );
      // ...and in firestore collection
      books.forEach(async (bookId, index) => {
        await updateBook(bookId, {
          "catalogue.record": currActive
            ? ""
            : `${catalogue.title.slice(0, 5)}/${startingIndex + index}`,
        });
      });
    }

    if (!response.error) {
      navigate(`/exlibris/catalogues/${id}`);
    }
  };

  // C) delete catalogue
  const handleDelete = async (id) => {
    if (catalogue.books.length !== 0) {
      setFormError(
        "Nie możesz usunąć katalogu, który nie jest pusty. Najpierw usuń książki lub przenieś je do innego katalogu."
      );
      return;
    }

    await deleteDocument(id);
    await updateUserData(user.uid, {
      catalogues: catalogues.filter((item) => item.id !== id),
    });
    if (!response.error) {
      navigate("/exlibris/catalogues");
    }
  };

  // Data fetching status
  if (catalogueError) {
    return <div className="error">{catalogueError}</div>;
  }
  if (!catalogue || !userData) {
    return <LoadingSpinner />;
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
