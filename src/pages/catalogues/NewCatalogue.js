import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import { arrayUnion } from "firebase/firestore";

import "./NewCatalogue.css";

import Select from "react-select";
import {
  sortingOptions,
  indexingOptions,
  customStyles,
  customTheme,
} from "../../utils/select";

export default function NewCatalogue() {
  // Context and router hooks
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Firestore hooks:
  // a) user data -> read/update existing catalogues
  const { document: userData } = useDocument("users", user.uid);
  const { updateDocument: updateUser } = useFirestore("users");
  // b) catalogues -> add new catalogue
  const { addDocument: addCatalogue, response: catalogueResponse } =
    useFirestore("catalogues");

  // Catalogue form inputs
  const [title, setTitle] = useState("");
  const [startingIndex, setStartingIndex] = useState(1);
  const [sortBooksBy, setSortBooksBy] = useState("description");
  const [isIndexed, setIsIndexed] = useState(true);

  // Form managment
  const [formError, setFormError] = useState(null);
  const [restrictedTitles, setRestrictedTitles] = useState([]);
  useEffect(() => {
    if (userData) {
      setRestrictedTitles(
        userData.catalogues.map((catalogue) => catalogue.title)
      );
    }
  }, [userData]);

  // BUTTON HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Input validation
    if (restrictedTitles.includes(title.trim())) {
      setFormError(`Masz już katalog o nazwie "${title.trim()}"`);
      return;
    }
    let parsedNumber = parseInt(startingIndex);
    if (!parsedNumber) {
      setFormError("Podana wartość nie jest liczbą");
      return;
    }
    if (parsedNumber < 1) {
      setFormError(
        "Nie możesz rozpocząć numerowania od liczby ujemnej lub zera"
      );
      return;
    }

    // Create an object representing the new catalogue
    const catalogue = {
      isActive: true,
      title: title.trim(),
      startingIndex: parsedNumber,
      isIndexed,
      sortBooksBy,
      books: [],
      createdBy: user.uid,
    };

    // Add new catalogue and update user data
    try {
      const docRef = await addCatalogue(catalogue);

      if (docRef) {
        await updateUser(user.uid, {
          catalogues: arrayUnion({
            id: docRef.id,
            title: title.trim(),
            isActive: true,
            isIndexed,
          }),
        });
      }

      if (!catalogueResponse.error) {
        navigate("/catalogues");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Data fetching status
  if (!userData) {
    return <div className="loading">Wczytywanie...</div>;
  }

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
          <span>Rozpocznij numerowanie od:</span>
          <input
            required
            type="number"
            onChange={(e) => setStartingIndex(e.target.value)}
            value={startingIndex}
          />
        </label>
        <label>
          <span>Sortuj pozycje w katalogu po:</span>
          <Select
            onChange={(option) => setSortBooksBy(option.value)}
            options={sortingOptions}
            defaultValue={sortingOptions[0]}
            isClearable={false}
            styles={customStyles}
            theme={customTheme}
          />
        </label>
        <label>
          <span>Indeksuj pozycje z katalogu:</span>
          <Select
            onChange={(option) => setIsIndexed(option.value)}
            options={indexingOptions}
            defaultValue={indexingOptions[0]}
            isClearable={false}
            styles={customStyles}
            theme={customTheme}
          />
        </label>
        {formError && <p className="error">{formError}</p>}
        <button className="btn">Stwórz katalog</button>
      </form>
    </div>
  );
}
