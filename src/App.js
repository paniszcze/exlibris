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
import Author from "./pages/authors/Author";
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
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="catalogues"
                element={user ? <Catalogues /> : <Navigate to="/login" />}
              />
              <Route
                path="catalogues/new"
                element={user ? <NewCatalogue /> : <Navigate to="/login" />}
              />
              <Route
                path="catalogues/:id"
                element={user ? <Catalogue /> : <Navigate to="/login" />}
              />
              <Route
                path="catalogues/:id/edit"
                element={user ? <EditCatalogue /> : <Navigate to="/login" />}
              />
              <Route
                path="books"
                element={user ? <Books /> : <Navigate to="/login" />}
              />
              <Route
                path="books/new"
                element={user ? <NewBook /> : <Navigate to="/login" />}
              />
              <Route
                path="books/:id"
                element={user ? <Book /> : <Navigate to="/login" />}
              />
              <Route
                path="books/:id/edit"
                element={user ? <EditBook /> : <Navigate to="/login" />}
              />
              <Route
                path="authors"
                element={user ? <Authors /> : <Navigate to="/login" />}
              />
              <Route
                path="authors/:id"
                element={user ? <Author /> : <Navigate to="/login" />}
              />
              <Route
                path="catalogues"
                element={user ? <Catalogues /> : <Navigate to="/login" />}
              />
              <Route
                path="catalogues/:id"
                element={user ? <Catalogue /> : <Login />}
              />
              <Route
                path="search"
                element={user ? <Search /> : <Navigate to="/login" />}
              />
              <Route
                path="login"
                element={user ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="signup"
                element={user ? <Navigate to="/" /> : <Signup />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}
