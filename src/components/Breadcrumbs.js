import { Link } from "react-router-dom";

import "./Breadcrumbs.css";

export default function Breadcrumbs() {
  return (
    <nav className="breadcrumbs" aria-label="breadcrumbs">
      <ol>
        <li>
          <Link to="/">Strona główna</Link>
        </li>
        <li>
          <Link to="books">Książki</Link>
        </li>
        <li>
          <Link to="books/0">Zrolowany wrześniowy Vogue</Link>
        </li>
        <li>
          <Link to="books/0/edit" aria-current="location">
            Edytuj pozycję
          </Link>
        </li>
      </ol>
    </nav>
  );
}
