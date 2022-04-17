import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";

import "./NewCatalogue.css";

import Select from "react-select";
import { customStyles, customTheme } from "../../utils/select";

export default function NewCatalogue() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { document: userData } = useDocument("users", user.uid);
  const { addDocument: addCatalogue, response: catalogueResponse } =
    useFirestore("catalogues");
  const { updateDocument: updateUser } = useFirestore("users");

  const [title, setTitle] = useState("");
  const [startingIndex, setStartingIndex] = useState("");
  const [sortBooksBy, setSortBooksBy] = useState("description");
  const [formError, setFormError] = useState(null);

  const [catalogues, setCatalogues] = useState([]);
  const [restrictedTitles, setRestrictedTitles] = useState([]);

  useEffect(() => {
    if (userData) {
      setCatalogues([...userData.catalogues]);
      setRestrictedTitles(
        userData.catalogues.map((catalogue) => catalogue.title)
      );
      setStartingIndex(userData.bookCount + 1);
    }
  }, [userData]);

  const sortingOptions = [
    { value: "description", label: "nazwisku autora" },
    { value: "title", label: "tytule książki" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

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
        "Nie możesz rozpocząć indeksowania od liczby ujemnej lub zera"
      );
      return;
    }

    const catalogue = {
      isActive: true,
      title: title.trim(),
      startingIndex: parsedNumber,
      sortBooksBy,
      books: [],
      createdBy: user.uid,
    };

    try {
      const docRef = await addCatalogue(catalogue);

      if (docRef) {
        await updateUser(user.uid, {
          catalogues: [
            ...catalogues,
            {
              id: docRef.id,
              title: title.trim(),
              isActive: true,
            },
          ],
        });
      }

      if (!catalogueResponse.error) {
        navigate("/catalogues");
      }
    } catch (error) {
      console.log(error.message);
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
        {formError && <p className="error">{formError}</p>}
        <button className="btn">Stwórz katalog</button>
      </form>
    </div>
  );
}
