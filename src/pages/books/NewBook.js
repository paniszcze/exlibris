import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import { arrayUnion, increment } from "firebase/firestore";

import Select from "react-select";
import CreatableInputOnly from "../../components/CreatableInputOnly";
import CreatableMulti from "../../components/CreatableMulti";
import {
  createOption,
  customStyles,
  customTheme,
  emptyMultiInput,
  listSelectedValues,
} from "../../utils/select";

import { createDescription } from "../../utils/description";

import "./NewBook.css";

export default function NewBook() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const { document: userData } = useDocument("users", user.uid);
  const { document: authorList } = useDocument("authors", user.uid);
  const { addDocument: addBook } = useFirestore("books");
  const { updateDocument: updateCatalogue } = useFirestore("catalogues");
  const { updateDocument: updateUser } = useFirestore("users");
  const { updateDocument: updateAuthors } = useFirestore("authors");

  const [activeCatalogues, setActiveCatalogues] = useState([]);
  const [existingAuthors, setExistingAuthors] = useState({
    ...emptyMultiInput,
  });
  const [formError, setFormError] = useState(null);

  const [catalogue, setCatalogue] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [volume, setVolume] = useState("");
  const [authors, setAuthors] = useState({ ...emptyMultiInput });
  const [translators, setTranslators] = useState({ ...emptyMultiInput });
  const [editors, setEditors] = useState({ ...emptyMultiInput });
  const [edition, setEdition] = useState("");
  const [place, setPlace] = useState("");
  const [year, setYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [series, setSeries] = useState({ ...emptyMultiInput });
  const [printRun, setPrintRun] = useState("");
  const [info, setInfo] = useState("");
  const [categories, setCategories] = useState({ ...emptyMultiInput });

  // Create options for react-select
  useEffect(() => {
    if (userData) {
      setActiveCatalogues(
        userData.catalogues
          .filter((catalogue) => Boolean(catalogue.isActive))
          .map((catalogue) => createOption(catalogue.title, catalogue.id))
      );
    }
  }, [userData]);

  useEffect(() => {
    if (authorList) {
      setExistingAuthors(
        Object.keys(authorList.authors).map((author) => createOption(author))
      );
    }
  }, [authorList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Cancel if book hasn't been assigned to any active catalogue
    if (!catalogue) {
      setFormError(
        "Wybierz aktywny katalog, do którego chcesz przypisać nową pozycję"
      );
      return;
    }

    // Create entry details and book data
    const entryDetails = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      volume: volume.trim(),
      authors: listSelectedValues(authors),
      translators: listSelectedValues(translators),
      editors: listSelectedValues(editors),
      edition: edition.trim(),
      place: place.trim(),
      year: year.trim(),
      publisher: publisher.trim(),
      series: listSelectedValues(series),
      printRun: printRun.trim(),
      info: info.trim(),
      tags: listSelectedValues(categories),
    };

    const book = {
      catalogue: {
        id: catalogue.value,
        title: catalogue.label,
        isDisposed: false,
        record: "",
        description: createDescription(entryDetails),
      },
      entryDetails,
      notes: [],
      createdBy: user.uid,
    };

    // Create book document and update linked data
    try {
      // create new document
      const docRef = await addBook(book);
      // proceed if the document has been successfully created
      if (docRef) {
        // update catalogue entries by adding new book's summary and ref
        const catalogueUpdate = {
          books: arrayUnion({
            title: book.entryDetails.title,
            description: book.catalogue.description,
            isDisposed: false,
            id: docRef.id,
          }),
        };
        await updateCatalogue(catalogue.value, catalogueUpdate);
        // update book count in user data
        await updateUser(user.uid, { bookCount: increment(1) });
      }
      // navigate to new book's detail page
      if (docRef) {
        navigate(`/books/${docRef.id}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Check for existing active catalogues
  if (userData && activeCatalogues.length === 0) {
    return (
      <p className="error">
        Obecnie nie masz żadnego aktywnego katalogu, do którego mógłbyś
        przypisać nową pozycję. Stwórz najpierw{" "}
        <Link to="/catalogues/new">nowy katalog</Link>.
      </p>
    );
  }

  // Display data fetching status
  if (!userData || !authorList) {
    return <div className="loading">Wczytywanie...</div>;
  }

  // Render the form for adding new books
  return (
    <div className="book-form">
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
          <span>Tom:</span>
          <input
            type="text"
            onChange={(e) => setVolume(e.target.value)}
            value={volume}
          />
        </label>
        <label>
          <span>Autor:</span>
          <CreatableMulti
            options={existingAuthors}
            state={authors}
            setState={setAuthors}
          />
        </label>
        <label>
          <span>Tłumacz:</span>
          <CreatableMulti
            options={existingAuthors}
            state={translators}
            setState={setTranslators}
          />
        </label>
        <label>
          <span>Redaktor:</span>
          <CreatableMulti
            options={existingAuthors}
            state={editors}
            setState={setEditors}
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
          <span>Nakład:</span>
          <input
            type="text"
            onChange={(e) => setPrintRun(e.target.value)}
            value={printRun}
          />
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
    </div>
  );
}
