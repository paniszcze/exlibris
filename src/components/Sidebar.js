import { Link, NavLink } from "react-router-dom";

import "./Sidebar.css";
import ListIcon from "../assets/list_icon.svg";
import BookIcon from "../assets/book_icon.svg";
import AuthorIcon from "../assets/author_icon.svg";
import AddIcon from "../assets/add_icon.svg";

export default function Sidebar() {
  const user = { displayName: "Daniel" };
  const stats = { books: "2873", catalogues: "22" };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <p>
            Witaj, <span className="username">{user.displayName}</span>
          </p>
        </div>
        <nav className="links">
          <ul>
            <li>
              <NavLink to="/">
                <img src={ListIcon} alt="list icon" />
                <span>Katalogi</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="books">
                <img src={BookIcon} alt="book icon" />
                <span>Książki</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="authors">
                <img src={AuthorIcon} alt="author icon" />
                <span>Autorzy</span>
              </NavLink>
            </li>
            <li>
              <Link to="books/new">
                <img src={AddIcon} alt="add icon" />
                <span>Dodaj książkę</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="stats">
          <p>
            Masz <strong>{stats.books}</strong> książki w{" "}
            <strong>{stats.catalogues}</strong>{" "}
            {stats.catalogues === "1" ? "katalogu" : "katalogach"}
          </p>
        </div>
      </div>
    </div>
  );
}
