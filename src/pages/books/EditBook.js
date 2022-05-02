import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import {
  arrayRemove,
  arrayUnion,
  deleteField,
  increment,
} from "firebase/firestore";

import "./EditBook.css";

import Select from "react-select";
import CreatableInputOnly from "../../components/CreatableInputOnly";
import CreatableMulti from "../../components/CreatableMulti";
import {
  createOption,
  createMultiInput,
  customStyles,
  customTheme,
  emptyMultiInput,
  listSelectedValues,
  getUniqueFromMultiInput,
} from "../../utils/select";
import LoadingSpinner from "../../components/LoadingSpinner";

import { createDescription } from "../../utils/description";
import { hasBookChanged, haveCreatorsChanged } from "../../utils/bookData";

export default function EditBook() {
  // Context and router hooks
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { id } = useParams();

  // Firestore hooks
  // a) current book's data -> read/update/delete
  const { document: book, error: bookError } = useDocument("books", id);
  const {
    updateDocument: updateBook,
    deleteDocument: deleteBook,
    response: bookResponse,
  } = useFirestore("books");
  // b) user data -> read active catalogues, update book count
  const { document: userData } = useDocument("users", user.uid);
  const { updateDocument: updateUserData } = useFirestore("users");
  // c) catalogues -> update/switch catalogue the book has been assigned to
  const { updateDocument: updateCatalogue } = useFirestore("catalogues");
  // d) author list -> read/update
  const { document: authorList } = useDocument("authors", user.uid);
  const { setDocument } = useFirestore("authors");
  // e) user's book index -> update
  const { updateDocument: updateIndex } = useFirestore("index");

  // FORM MANAGEMENT
  const [formError, setFormError] = useState(null);

  // Create react-select options for:
  // a) active catalogues
  const [activeCatalogues, setActiveCatalogues] = useState([]);
  useEffect(() => {
    if (userData) {
      setActiveCatalogues(
        userData.catalogues
          .filter((catalogue) => Boolean(catalogue.isActive))
          .sort((a, b) => new Intl.Collator("pl").compare(a.title, b.title))
          .map((catalogue) => createOption(catalogue.title, catalogue.id))
      );
    }
  }, [userData]);
  // b) existing authors
  const [existingAuthors, setExistingAuthors] = useState({
    ...emptyMultiInput,
  });
  useEffect(() => {
    if (authorList) {
      setExistingAuthors(
        Object.keys(authorList).reduce((prev, curr) => {
          if (authorList[curr] > 0) {
            prev.push(createOption(curr));
          }
          return prev;
        }, [])
      );
    }
  }, [authorList]);

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

    // Input validation:
    // Cancel if book hasn't been assigned to any active catalogue
    if (!catalogue) {
      setFormError(
        "Wybierz aktywny katalog, do którego chcesz przypisać nową pozycję"
      );
      return;
    }

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

    // Compare previous and current book details to check, if the data
    // has changed. If not, there is no need for updating the db.
    // Otherwise proceed with necessary updates.
    if (
      catalogue.value !== book.catalogue.id ||
      hasBookChanged(book.entryDetails, updatedEntryDetails)
    ) {
      // 1) Delete book data from containing catalogue
      await updateCatalogue(book.catalogue.id, {
        books: arrayRemove({
          title: book.entryDetails.title,
          description: book.catalogue.description,
          isDisposed: book.catalogue.isDisposed,
          id: id,
          createdAt: book.catalogue.createdAt,
        }),
      });
      // 2) Add updated book data to destination catalogue
      //    (destination can be the same as source)
      await updateCatalogue(catalogue.value, {
        books: arrayUnion({
          title: updatedEntryDetails.title,
          description: createDescription(updatedEntryDetails),
          isDisposed: book.catalogue.isDisposed,
          id: id,
          createdAt: book.catalogue.createdAt,
        }),
      });

      // Control flow in points 3), 4) and 5) depends on the values of isIndexed
      // of source and destination catalogues. The expected behaviour is
      // illustrated by the table below:
      //   prev:     curr:
      //  FALSE  ->  FALSE   (SKIP)     do nothing (no data was nor is indexed)
      //  FALSE  ->  TRUE    (ADD)      add all details (as if it were a new book)
      //   TRUE  ->  FALSE   (DELETE)   delete indexed (old) data
      //   TRUE  ->  TRUE    (UPDATE)   update details
      let isPrevIndexed = book.catalogue.isIndexed;
      let isCurrIndexed = userData.catalogues.find(
        (item) => item.id === catalogue.value
      ).isIndexed;

      // 3) Modify user's authors list if necessary
      if (isPrevIndexed && isCurrIndexed) {
        // UPDATE:
        const creators = haveCreatorsChanged(
          book.entryDetails,
          updatedEntryDetails
        );
        if (creators.haveChanged) {
          await setDocument(
            user.uid,
            Object.fromEntries(
              creators.changes.map((change) => [
                change[0],
                increment(change[1]),
              ])
            ),
            { merge: true }
          );
        }
      } else if (isPrevIndexed || isCurrIndexed) {
        // DELETE/ADD
        const creators = isPrevIndexed
          ? [
              ...new Set([
                ...book.entryDetails.authors,
                ...book.entryDetails.translators,
                ...book.entryDetails.editors,
              ]),
            ]
          : getUniqueFromMultiInput(authors, editors, translators);
        if (creators.length > 0) {
          await setDocument(
            user.uid,
            Object.fromEntries(
              creators.map((name) => [name, increment(isPrevIndexed ? -1 : 1)])
            ),
            { merge: true }
          );
        }
      }
      // 4) Update user's book index if destination catalogue is indexed.
      //    Otherwise, check if source catalogue is indexed. If positive,
      //    it means that there exists a book entry to be deleted from index.
      if (isCurrIndexed) {
        // ADD/UPDATE (both are invoked the same way)
        await updateIndex(
          user.uid,
          Object.fromEntries([
            [
              `books.${book.id}`,
              {
                id: book.id,
                title: updatedEntryDetails.title,
                subtitle: updatedEntryDetails.subtitle,
                authors: updatedEntryDetails.authors,
                translators: updatedEntryDetails.translators,
                editors: updatedEntryDetails.editors,
                publisher: updatedEntryDetails.publisher,
                series: updatedEntryDetails.series,
                tags: updatedEntryDetails.tags,
                description: createDescription(updatedEntryDetails),
                record: userData.catalogues.find(
                  (item) => item.id === catalogue.value
                ).isActive
                  ? ""
                  : book.catalogue.record,
                isDisposed: book.catalogue.isDisposed,
                catalogue: catalogue.label,
              },
            ],
          ])
        );
      } else if (isPrevIndexed) {
        // DELETE
        await updateIndex(
          user.uid,
          Object.fromEntries([[`books.${book.id}`, deleteField()]])
        );
      }
      // 5) Update book count in user data if indexing has changed
      if (isPrevIndexed && !isCurrIndexed) {
        await updateUserData(user.uid, { bookCount: increment(-1) });
      } else if (!isPrevIndexed && isCurrIndexed) {
        await updateUserData(user.uid, { bookCount: increment(1) });
      }

      // 6) Update props in book document
      await updateBook(id, {
        entryDetails: updatedEntryDetails,
        "catalogue.description": createDescription(updatedEntryDetails),
        "catalogue.id": catalogue.value,
        "catalogue.title": catalogue.label,
        "catalogue.isIndexed": isCurrIndexed,
      });
    }

    if (!bookResponse.error) {
      navigate(`/exlibris/books/${id}`);
    }
  };

  // B) dispose the book
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
        createdAt: book.catalogue.createdAt,
      }),
    });
    await updateCatalogue(book.catalogue.id, {
      books: arrayUnion({
        title: book.entryDetails.title,
        description: book.catalogue.description,
        isDisposed: toggledValue,
        id: book.id,
        createdAt: book.catalogue.createdAt,
      }),
    });
    // update book index
    await updateIndex(
      user.uid,
      Object.fromEntries([[`books.${id}.isDisposed`, toggledValue]])
    );

    if (!bookResponse.error) {
      navigate(`/exlibris/books/${id}`);
    }
  };

  // C) delete the book
  const handleDelete = async (id) => {
    // Prevent from deleting books from archived catalogues
    if (
      !userData.catalogues.find((item) => item.id === book.catalogue.id)
        .isActive
    ) {
      setFormError(
        `Nie możesz usunąć pozycji przypisanej do zarchiwizowanego katalogu. Zdearchiwizuj najpierw katalog "${book.catalogue.title}".`
      );
      return;
    }

    // Delete book data from containing catalogue
    await updateCatalogue(book.catalogue.id, {
      books: arrayRemove({
        title: book.entryDetails.title,
        description: book.catalogue.description,
        isDisposed: book.catalogue.isDisposed,
        id: book.id,
        createdAt: book.catalogue.createdAt,
      }),
    });

    // Update user related data only if the containing catalogue is indexed
    if (book.catalogue.isIndexed) {
      // 1) decrement book count in user data
      await updateUserData(user.uid, { bookCount: increment(-1) });
      // 2) delete book from user's index
      await updateIndex(
        user.uid,
        Object.fromEntries([[`books.${book.id}`, deleteField()]])
      );
      // 3) update user's authors list
      const creators = getUniqueFromMultiInput(authors, editors, translators);
      if (creators.length > 0) {
        await setDocument(
          user.uid,
          Object.fromEntries(creators.map((name) => [name, increment(-1)])),
          { merge: true }
        );
      }
    }

    // Finally, delete book document
    await deleteBook(id);

    // Navigate to books subpage
    if (!bookResponse.error) {
      navigate("/exlibris/books");
    }
  };

  // Display data fetching status
  if (bookError) {
    return <div className="error">{bookError}</div>;
  }
  if (!book || !userData) {
    return <LoadingSpinner />;
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
