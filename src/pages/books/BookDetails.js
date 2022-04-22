import { useState } from "react";
import { Link } from "react-router-dom";

import "./BookDetails.css";

import Modal from "../../components/Modal";
import BookDescription from "./BookDescription";

export default function BookDetails({ entry, catalogue }) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="book-block">
      <div className="book-details">
        <h2 className={`page-title${catalogue.isDisposed ? " disposed" : ""}`}>
          {entry.title}
        </h2>
        {entry.subtitle && <h3>{entry.subtitle}</h3>}
        {entry.volume && <h3>t. {entry.volume}</h3>}
        {entry.authors.length > 0 && (
          <>
            <h4>Autor:</h4>
            <p>
              {entry.authors.map((author, index) => (
                <Link to={`/search?author=${author.toLowerCase()}`} key={index}>
                  {author}
                </Link>
              ))}
            </p>
          </>
        )}
        {entry.translators.length > 0 && (
          <>
            <h4>Tłumacz:</h4>
            <p>
              {entry.translators.map((translator, index) => (
                <Link
                  to={`/search?author=${translator.toLowerCase()}`}
                  key={index}
                >
                  {translator}
                </Link>
              ))}
            </p>
          </>
        )}
        {entry.editors.length > 0 && (
          <>
            <h4>Redaktor:</h4>
            <p>
              {entry.editors.map((editor, index) => (
                <Link to={`/search?author=${editor.toLowerCase()}`} key={index}>
                  {editor}
                </Link>
              ))}
            </p>
          </>
        )}
        {entry.edition && (
          <>
            <h4>Wydanie:</h4>
            <p>{entry.edition}</p>
          </>
        )}
        {entry.place && entry.year ? (
          <>
            <h4>Miejsce i rok wydania:</h4>
            <p>
              {entry.place}, {entry.year}
            </p>
          </>
        ) : entry.place ? (
          <>
            <h4>Miejsce wydania:</h4>
            <p>{entry.place}</p>
          </>
        ) : (
          entry.year && (
            <>
              <h4>Rok wydania:</h4>
              <p>{entry.year}</p>
            </>
          )
        )}
        {entry.publisher && (
          <>
            <h4>Wydawca:</h4>
            <p>{entry.publisher}</p>
          </>
        )}
        {entry.printRun && (
          <>
            <h4>Nakład:</h4>
            <p>{entry.printRun}</p>
          </>
        )}
        {entry.series.length > 0 && (
          <>
            <h4>Serie:</h4>
            <p>
              {entry.series.map((series, index) => (
                <span key={index}>{series}</span>
              ))}
            </p>
          </>
        )}
        {entry.tags.length > 0 && (
          <>
            <h4>Kategorie:</h4>
            <p>
              {entry.tags.map((tag, index) => (
                <em key={index}>{tag}</em>
              ))}
            </p>
          </>
        )}
        {entry.info && (
          <>
            <h4>Dodatkowe informacje:</h4>
            <p>{entry.info}</p>
          </>
        )}
        {catalogue.record && (
          <>
            <h4>Numer katalogowy:</h4>
            <p>{catalogue.record}</p>
          </>
        )}
      </div>
      <div className="btn-container">
        <Link to="edit" className="btn">
          Edytuj pozycję
        </Link>
        <button onClick={() => setShowDescription(true)} className="btn">
          Pokaż opis
        </button>
        <Link to={`/catalogues/${catalogue.id}`} className="btn">
          Zobacz w katalogu
        </Link>
      </div>
      {showDescription && (
        <Modal setIsOpen={setShowDescription}>
          <BookDescription description={catalogue.description} />
        </Modal>
      )}
    </div>
  );
}
