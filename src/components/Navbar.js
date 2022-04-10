import { Link } from "react-router-dom";

import "./Navbar.css";
import Logo from "../assets/logo.svg";

export default function Navbar() {
  const logout = () => {};

  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <img src={Logo} alt="logo" />
          <span>exLibris</span>
        </li>
        <li>
          <Link to="/login">Zaloguj</Link>
        </li>
        <li>
          <Link to="/signup">Załóż konto</Link>
        </li>
        <li>
          <button className="btn" onClick={logout}>
            Wyloguj
          </button>
        </li>
      </ul>
    </nav>
  );
}
