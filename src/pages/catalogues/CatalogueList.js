import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./CatalogueList.css";

export default function CatalogueList({ catalogues }) {
  const [activeCatalogues, setActiveCatalogues] = useState([]);
  const [archivedCatalogues, setArchivedCatalogues] = useState([]);

  useEffect(() => {
    catalogues
      .filter((catalogue) => Boolean(catalogue))
      .sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      })
      .map((catalogue) =>
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
        <>
          <ul>
            {activeCatalogues.map((catalogue) => (
              <li key={catalogue.id}>
                <Link to={`/catalogues/${catalogue.id}`}>
                  {catalogue.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="info">Brak aktywnych katalogów</p>
      )}
      <Link to="new" className="btn">
        Nowy katalog
      </Link>
      <h4>Zarchiwizowane</h4>
      {archivedCatalogues.length > 0 ? (
        <>
          <ul>
            {archivedCatalogues.map((catalogue) => (
              <li key={catalogue.id}>
                <Link to={`/catalogues/${catalogue.id}`}>
                  {catalogue.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="info">Brak zarchiwizowanych katalogów</p>
      )}
    </div>
  );
}
