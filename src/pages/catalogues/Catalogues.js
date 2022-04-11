import { useCollection } from "../../hooks/useCollection";

import "./Catalogues.css";

import CatalogueList from "./CatalogueList";

export default function Catalogues() {
  const { documents: catalogues } = useCollection("catalogues");

  return (
    <div className="catalogues">
      <h2 className="page-title">Moje katalogi</h2>
      {catalogues && <CatalogueList catalogues={catalogues} />}
    </div>
  );
}
