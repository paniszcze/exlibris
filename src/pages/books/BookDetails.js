import { Link } from "react-router-dom";

export default function BookDetails({ entry, record }) {
  const handleClick = () => {
    console.log("Edytuj pozycję");
  };

  return (
    <div>
      <div className="book-details">
        <h2 className="page-title">{entry.title}</h2>
        {entry.subtitle && <h3>{entry.subtitle}</h3>}
        <h4>Autor:</h4>
        <p>
          {entry.authors.map((author, index) => (
            <Link to="/authors/0" key={index}>
              {author}
            </Link>
          ))}
        </p>
        {entry.translators[0] && (
          <>
            <h4>Tłumacz:</h4>
            <p>
              {entry.translators.map((translator, index) => (
                <span key={index}>{translator}</span>
              ))}
            </p>
          </>
        )}
        {entry.editors[0] && (
          <>
            <h4>Redaktor:</h4>
            <p>
              {entry.editors.map((editor, index) => (
                <span key={index}>{editor}</span>
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
        {entry.series[0] && (
          <>
            <h4>Serie:</h4>
            <p>
              {entry.series.map((series, index) => (
                <span key={index}>{series}</span>
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
        {entry.tags[0] && (
          <>
            <h4>Kategorie:</h4>
            <p>
              {entry.tags.map((tag, index) => (
                <em key={index}>{tag}</em>
              ))}
            </p>
          </>
        )}
        {record && (
          <>
            <h4>Numer katalogowy:</h4>
            <p>{record}</p>
          </>
        )}
      </div>
      <button className="btn" onClick={handleClick}>
        Edytuj pozycję
      </button>
    </div>
  );
}
