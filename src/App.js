import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/Breadcrumbs";

import Catalogues from "./pages/catalogues/Catalogues";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Books from "./pages/books/Books";
import Book from "./pages/books/Book";
import NewBook from "./pages/books/NewBook";
import Authors from "./pages/authors/Authors";
import Author from "./pages/authors/Author";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar />
        <div className="container">
          <Navbar />
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<Catalogues />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="books" element={<Books />} />
            <Route path="books/:id" element={<Book />} />
            <Route path="books/new" element={<NewBook />} />
            <Route path="authors" element={<Authors />} />
            <Route path="authors/:id" element={<Author />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
