import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./CatalogueList.css";
import UntrackedIcon from "../../assets/untracked_icon.svg";

export default function CatalogueList({ catalogues }) {
  const [activeCatalogues, setActiveCatalogues] = useState([]);
  const [archivedCatalogues, setArchivedCatalogues] = useState([]);

  useEffect(() => {
    catalogues
      .filter(Boolean)
      .sort((a, b) => new Intl.Collator("pl").compare(a.title, b.title))
      .forEach((catalogue) =>
        catalogue.isActive
          ? setActiveCatalogues((prevState) => [...prevState, catalogue])
          : setArchivedCatalogues((prevState) => [...prevState, catalogue])
      );

    return () => {
      setActiveCatalogues([]);
      setArchivedCatalogues([]);
    };
  }, [catalogues]);

  return (
    <div className="catalogue-list">
      <h4>Aktywne katalogi</h4>
      {activeCatalogues.length > 0 ? (
        <ul>
          {activeCatalogues.map((catalogue) => (
            <li key={catalogue.id}>
              <Link to={`/catalogues/${catalogue.id}`}>
                {catalogue.title}
                {!catalogue.isIndexed && (
                  <img src={UntrackedIcon} alt="untracked icon" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="info">Brak aktywnych katalogów</p>
      )}
      <Link to="new" className="btn">
        Stwórz nowy katalog
      </Link>
      <h4>Zarchiwizowane</h4>
      {archivedCatalogues.length > 0 ? (
        <ul>
          {archivedCatalogues.map((catalogue) => (
            <li key={catalogue.id}>
              <Link to={`/catalogues/${catalogue.id}`}>{catalogue.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="info">Brak zarchiwizowanych katalogów</p>
      )}
    </div>
  );
}
