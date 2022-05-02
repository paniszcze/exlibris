import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

import "./Sidebar.css";
import ListIcon from "../assets/list_icon.svg";
import BookIcon from "../assets/book_icon.svg";
import AuthorIcon from "../assets/author_icon.svg";
import SearchIcon from "../assets/search_icon.svg";
import AddIcon from "../assets/add_icon.svg";

export default function Sidebar() {
  const { user } = useAuthContext();

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <p>
            <span className="username">{user.displayName}</span>
          </p>
        </div>
        <nav className="links">
          <ul>
            <li>
              <NavLink to="exlibris/catalogues">
                <img src={ListIcon} alt="list icon" />
                <span>Katalogi</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="exlibris/books">
                <img src={BookIcon} alt="book icon" />
                <span>Książki</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="exlibris/authors">
                <img src={AuthorIcon} alt="author icon" />
                <span>Autorzy</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="exlibris/search">
                <img src={SearchIcon} alt="search icon" />
                <span>Szukaj</span>
              </NavLink>
            </li>
            <li>
              <Link to="exlibris/books/new">
                <img src={AddIcon} alt="add icon" />
                <span>Dodaj książkę</span>
              </Link>
            </li>
          </ul>
        </nav>
        <footer className="footnote">
          z dedykacją dla Jarka
          <br />
          zbudował{" "}
          <a
            href="https://github.com/paniszcze/exlibris"
            rel="noreferrer"
            target="_blank"
          >
            paniszcze
          </a>{" "}
          w 2022
          <br />
          &#128150;
        </footer>
      </div>
    </div>
  );
}
