import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/home/Home";
import Catalogues from "./pages/catalogues/Catalogues";
import Catalogue from "./pages/catalogues/Catalogue";
import NewCatalogue from "./pages/catalogues/NewCatalogue";
import EditCatalogue from "./pages/catalogues/EditCatalogue";
import Books from "./pages/books/Books";
import Book from "./pages/books/Book";
import NewBook from "./pages/books/NewBook";
import EditBook from "./pages/books/EditBook";
import Authors from "./pages/authors/Authors";
import Search from "./pages/search/Search";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";

export default function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              <Route
                path="exlibris/"
                element={user ? <Home /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/catalogues"
                element={user ? <Catalogues /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/catalogues/new"
                element={user ? <NewCatalogue /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/catalogues/:id"
                element={user ? <Catalogue /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/catalogues/:id/edit"
                element={user ? <EditCatalogue /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/books"
                element={user ? <Books /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/books/new"
                element={user ? <NewBook /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/books/:id"
                element={user ? <Book /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/books/:id/edit"
                element={user ? <EditBook /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/authors"
                element={user ? <Authors /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/catalogues"
                element={user ? <Catalogues /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/catalogues/:id"
                element={user ? <Catalogue /> : <Login />}
              />
              <Route
                path="exlibris/search"
                element={user ? <Search /> : <Navigate to="/exlibris/login" />}
              />
              <Route
                path="exlibris/login"
                element={user ? <Navigate to="/exlibris/" /> : <Login />}
              />
              <Route
                path="exlibris/signup"
                element={user ? <Navigate to="/exlibris/" /> : <Signup />}
              />
              <Route
                path="*"
                element={
                  user ? (
                    <p className="error">Podana strona nie istnieje...</p>
                  ) : (
                    <Login />
                  )
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}
