import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import { arrayRemove, arrayUnion, increment } from "firebase/firestore";

import "./EditBook.css";

import Select from "react-select";
import CreatableInputOnly from "../../components/CreatableInputOnly";
import {
  createOption,
  createMultiInput,
  customStyles,
  customTheme,
  emptyMultiInput,
  listSelectedValues,
} from "../../utils/select";

import { createDescription } from "../../utils/description";
import { hasBookChanged } from "../../utils/bookData";

export default function EditBook() {
  // Context and router hooks
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { id } = useParams();

  // Firestore hooks
  // a) current book's data -> read/update
  const { document: book, error: bookError } = useDocument("books", id);
  const {
    updateDocument: updateBook,
    deleteDocument: deleteBook,
    response: bookResponse,
  } = useFirestore("books");
  // b) user data -> read active actalogues, update book count
  const { document: userData } = useDocument("users", user.uid);
  const { updateDocument: updateUserData } = useFirestore("users");
  // c) catalogues -> update/switch catalogue the book has been assigned to
  const { updateDocument: updateCatalogue } = useFirestore("catalogues");

  // FORM MANAGEMENT
  const [formError, setFormError] = useState(null);

  // Create react-select options for available catalogues
  const [activeCatalogues, setActiveCatalogues] = useState([]);
  useEffect(() => {
    if (userData) {
      setActiveCatalogues(
        userData.catalogues
          .filter((catalogue) => Boolean(catalogue.isActive))
          .map((catalogue) => createOption(catalogue.title, catalogue.id))
      );
    }
  }, [userData]);

  // Input state variables
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

  // Populate form with current book's props
  useEffect(() => {
    if (book) {
      setCatalogue(createOption(book.catalogue.title, book.catalogue.id));
      setTitle(book.entryDetails.title);
      setSubtitle(book.entryDetails.subtitle);
      setVolume(book.entryDetails.volume);
      setAuthors(createMultiInput(book.entryDetails.authors));
      setTranslators(createMultiInput(book.entryDetails.translators));
      setEditors(createMultiInput(book.entryDetails.editors));
      setEdition(book.entryDetails.edition);
      setPlace(book.entryDetails.place);
      setYear(book.entryDetails.year);
      setPublisher(book.entryDetails.publisher);
      setSeries(createMultiInput(book.entryDetails.series));
      setPrintRun(book.entryDetails.printRun);
      setInfo(book.entryDetails.info);
      setCategories(createMultiInput(book.entryDetails.tags));
    }
  }, [book]);

  // BUTTON HANDLERS
  // A) submit changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Create an object with new entry details
    const updatedEntryDetails = {
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

    // Update book and catalogue(s) only if there has been any change
    if (
      catalogue.value !== book.catalogue.id ||
      hasBookChanged(book.entryDetails, updatedEntryDetails)
    ) {
      // 1) delete book data from containing catalogue
      await updateCatalogue(book.catalogue.id, {
        books: arrayRemove({
          title: book.entryDetails.title,
          description: book.catalogue.description,
          isDisposed: book.catalogue.isDisposed,
          id: id,
        }),
      });
      // 2) add updated book data to destination catalogue
      await updateCatalogue(catalogue.value, {
        books: arrayUnion({
          title: updatedEntryDetails.title,
          description: createDescription(updatedEntryDetails),
          isDisposed: book.catalogue.isDisposed,
          id: id,
        }),
      });
      // 3) update props in book document
      await updateBook(id, {
        entryDetails: updatedEntryDetails,
        "catalogue.description": createDescription(updatedEntryDetails),
        "catalogue.id": catalogue.value,
        "catalogue.title": catalogue.label,
      });
    }

    if (!bookResponse.error) {
      navigate(`/books/${id}`);
    }
  };

  // B) dispose book
  const toggleIsDisposed = async (id) => {
    const toggledValue = !book.catalogue.isDisposed;
    // update book document
    await updateBook(id, { "catalogue.isDisposed": toggledValue });
    // update book data in containing catalogue
    await updateCatalogue(book.catalogue.id, {
      books: arrayRemove({
        title: book.entryDetails.title,
        description: book.catalogue.description,
        isDisposed: book.catalogue.isDisposed,
        id: book.id,
      }),
    });
    await updateCatalogue(book.catalogue.id, {
      books: arrayUnion({
        title: book.entryDetails.title,
        description: book.catalogue.description,
        isDisposed: toggledValue,
        id: book.id,
      }),
    });

    if (!bookResponse.error) {
      navigate(`/books/${id}`);
    }
  };

  // C) delete the book
  const handleDelete = async (id) => {
    // prevent from deleting books from archived catalogues
    if (!book.catalogue.isActive) {
      setFormError(
        `Nie możesz usunąć pozycji przypisanej do zarchiwizowanego katalogu. Zdearchiwizuj najpierw katalog "${book.catalogue.title}".`
      );
      return;
    }
    // delete book data from containing catalogue
    await updateCatalogue(book.catalogue.id, {
      books: arrayRemove({
        title: book.entryDetails.title,
        description: book.catalogue.description,
        isDisposed: book.catalogue.isDisposed,
        id: book.id,
      }),
    });
    // decrement book count in user data
    await updateUserData(user.uid, { bookCount: increment(-1) });
    // delete book document
    await deleteBook(id);

    if (!bookResponse.error) {
      navigate("/books");
    }
  };

  // Display data fetching status
  if (bookError) {
    return <div className="error">{bookError}</div>;
  }
  if (!book || !userData) {
    return <div className="loading">Wczytywanie...</div>;
  }

  return (
    <div className="book-form">
      <h2 className="page-title">Edytuj pozycję</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Dodaj do katalogu:</span>
          <Select
            onChange={(option) => setCatalogue(option)}
            options={activeCatalogues}
            defaultValue={createOption(book.catalogue.title, book.catalogue.id)}
            placeholder="Wybierz z listy"
            noOptionsMessage={() => "Brak aktywnych katalogów"}
            isClearable
            isDisabled={
              !userData.catalogues.find((item) => item.id === book.catalogue.id)
                .isActive || activeCatalogues.length < 2
            }
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
          <CreatableInputOnly state={authors} setState={setAuthors} />
        </label>
        <label>
          <span>Tłumacz:</span>
          <CreatableInputOnly state={translators} setState={setTranslators} />
        </label>
        <label>
          <span>Redaktor:</span>
          <CreatableInputOnly state={editors} setState={setEditors} />
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
        <div className="btn-container">
          <button type="submit" className="btn">
            Zapisz zmiany
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => toggleIsDisposed(id)}
          >
            {book.catalogue.isDisposed ? "Anuluj ubytkowanie" : "Ubytkuj"}
          </button>
          <button
            type="button"
            className="btn danger"
            onClick={() => handleDelete(id)}
          >
            Usuń pozycję
          </button>
        </div>
      </form>
    </div>
  );
}
