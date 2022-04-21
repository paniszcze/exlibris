import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

import "./Home.css";

import { decline } from "../../utils/inflection";

export default function Home() {
  const { user } = useAuthContext();
  const { document: userData, error } = useDocument("users", user.uid);
  const [activeCatalogues, setActiveCatalogues] = useState([]);

  useEffect(() => {
    if (userData) {
      setActiveCatalogues(
        userData.catalogues
          .filter((catalogue) => Boolean(catalogue.isActive))
          .sort((a, b) => new Intl.Collator("pl").compare(a.title, b.title))
      );
    }
  }, [userData]);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!userData) {
    return <div className="loading">Wczytywanie...</div>;
  }

  return (
    <div className="home">
      <h2 className="page-title">Witaj, {user.displayName}</h2>
      <p>
        Masz <strong>{userData.bookCount}</strong>{" "}
        {decline("książka", userData.bookCount)} w{" "}
        <strong>{userData.catalogues.length}</strong>{" "}
        {decline("katalog", userData.catalogues.length)}
      </p>
      {activeCatalogues.length > 0 && (
        <div className="activity">
          <h3>Twoje bieżące katalogi</h3>
          <ul>
            {activeCatalogues.map((catalogue) => (
              <li key={catalogue.id}>
                <Link to={`/catalogues/${catalogue.id}`}>
                  {catalogue.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
