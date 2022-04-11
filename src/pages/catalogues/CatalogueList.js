import { Link } from "react-router-dom";

import "./CatalogueList.css";

export default function CatalogueList({ catalogues }) {
  if (catalogues.length === 0) {
    return <p>Brak katalogów do wyświetlenia</p>;
  }

  const activeCatalogues = [];
  const archivedCatalogues = [];
  catalogues.map((catalogue) =>
    catalogue.isActive
      ? activeCatalogues.push(catalogue)
      : archivedCatalogues.push(catalogue)
  );

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
        <p>Brak aktywnych katalogów</p>
      )}
      <button className="btn">Nowy katalog</button>
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
        <p>Brak zarchiwizowanych katalogów</p>
      )}
    </div>
  );
}
