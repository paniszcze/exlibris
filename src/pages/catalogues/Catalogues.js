import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

import "./Catalogues.css";

import CatalogueList from "./CatalogueList";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Catalogues() {
  const { user } = useAuthContext();
  const { document: userData, error } = useDocument("users", user.uid);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="catalogues">
      <h2 className="page-title">Moje katalogi</h2>
      {userData ? (
        <CatalogueList catalogues={userData.catalogues} />
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
