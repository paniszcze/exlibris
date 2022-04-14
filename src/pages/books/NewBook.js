import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";

import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

import Select from "react-select";
import CreatableInputOnly from "../../components/CreatableInputOnly";
import { customStyles, customTheme } from "../../utils/selectStyles";

import "./NewBook.css";

const listSelectedValues = (selectState) =>
  [...selectState.value].map((item) => item.value);

export default function NewBook() {
  const { user } = useAuthContext();
  const { document: userData } = useDocument("users", user.uid);
  const { updateDocument, response } = useFirestore("catalogues");
  const navigate = useNavigate();

  const [activeCatalogues, setActiveCatalogues] = useState([]);
  const [formError, setFormError] = useState(null);

  const [catalogue, setCatalogue] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [place, setPlace] = useState("");
  const [edition, setEdition] = useState("");
  const [publisher, setPublisher] = useState("");
  const [series, setSeries] = useState({
    inputValue: "",
    value: [],
  });
  const [categories, setCategories] = useState({
    inputValue: "",
    value: [],
  });
  const [info, setInfo] = useState("");

  // create values for react-select
  useEffect(() => {
    if (userData) {
      setActiveCatalogues(
        userData.catalogues
          .filter((catalogue) => Boolean(catalogue.isActive))
          .map((catalogue) => {
            return { value: catalogue.id, label: catalogue.title };
          })
      );
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!catalogue) {
      setFormError(
        "Wybierz aktywny katalog, do którego chcesz przypisać nową pozycję"
      );
      return;
    }

    const book = {
      catalogue: {
        isDisposed: false,
        record: "",
        description: "",
      },
      entryDetails: {
        title: title.trim(),
        subtitle: subtitle.trim(),
        authors: [],
        translators: [],
        editors: [],
        year: year.trim(),
        place: place.trim(),
        edition: edition.trim(),
        publisher: publisher.trim(),
        series: listSelectedValues(series),
        tags: listSelectedValues(categories),
        info: info.trim(),
      },
      notes: [],
      createdBy: user.uid,
    };

    const updates = { books: [book] };

    console.log(book);

    try {
      await updateDoc(doc(db, "catalogues", catalogue.value), updates);
    } catch (error) {
      console.log(error.message);
    }

    // await updateDocument(catalogue.id, updates)
    // if (!response.error) {
    //   navigate('/')
    // }
  };

  if (userData && activeCatalogues.length === 0) {
    return (
      <p className="error">
        Obecnie nie masz żadnego aktywnego katalogu, do którego mógłbyś
        przypisać nową pozycję. Stwórz najpierw{" "}
        <Link to="/catalogues/new">nowy katalog</Link>.
      </p>
    );
  }

  return (
    <div className="book-form">
      {userData && (
        <>
          <h2 className="page-title">Dodaj książkę</h2>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Dodaj do katalogu:</span>
              <Select
                onChange={(option) => setCatalogue(option)}
                options={activeCatalogues}
                required={true}
                placeholder="Wybierz z listy"
                noOptionsMessage={() => "Brak aktywnych katalogów"}
                isClearable
                styles={customStyles}
                theme={customTheme}
              />
            </label>
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
              <span>Podtytuł:</span>
              <input
                type="text"
                onChange={(e) => setSubtitle(e.target.value)}
                value={subtitle}
              />
            </label>
            <label>
              <span>Wydanie:</span>
              <input
                type="text"
                onChange={(e) => setEdition(e.target.value)}
                value={edition}
              />
            </label>
            <label>
              <span>Rok wydania:</span>
              <input
                type="text"
                onChange={(e) => setYear(e.target.value)}
                value={year}
              />
            </label>
            <label>
              <span>Miejsce wydania:</span>
              <input
                type="text"
                onChange={(e) => setPlace(e.target.value)}
                value={place}
              />
            </label>
            <label>
              <span>Wydawca:</span>
              <input
                type="text"
                onChange={(e) => setPublisher(e.target.value)}
                value={publisher}
              />
            </label>
            <label>
              <span>Seria wydawnicza:</span>
              <CreatableInputOnly state={series} setState={setSeries} />
            </label>
            <label>
              <span>Kategoria:</span>
              <CreatableInputOnly state={categories} setState={setCategories} />
            </label>
            <label>
              <span>Dodatkowe informacje:</span>
              <input
                type="text"
                onChange={(e) => setInfo(e.target.value)}
                value={info}
              />
            </label>
            {formError && <p className="error">{formError}</p>}
            <button className="btn">Dodaj książkę</button>
          </form>
        </>
      )}
    </div>
  );
}
