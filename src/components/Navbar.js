import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

import "./Navbar.css";
import Logo from "../assets/logo.svg";

import Breadcrumbs from "./Breadcrumbs";

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  return (
    <div className="navbar">
      <div className="logo">
        <img src={Logo} alt="exLibris logo" />
        <span>exLibris</span>
      </div>
      {user && <Breadcrumbs />}
      <ul className="user-nav">
        {!user ? (
          <>
            <li>
              <Link to="/exlibris/login">Zaloguj</Link>
            </li>
            <li>
              <Link to="/exlibris/signup">Załóż konto</Link>
            </li>
          </>
        ) : (
          <li>
            {isPending ? (
              <button className="btn" disabled>
                Wylogowuję...
              </button>
            ) : (
              <button className="btn" onClick={logout}>
                Wyloguj
              </button>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
