import { useEffect, useState } from "react";
import { useLocation, matchPath, Link } from "react-router-dom";

import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

import "./Breadcrumbs.css";

function DynamicTitle({ id, collection }) {
  const [title, setTitle] = useState("...");

  useEffect(() => {
    async function getTitle() {
      try {
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let t =
            collection === "books"
              ? docSnap.data().entryDetails.title
              : docSnap.data().title;
          if (t.length > 30) {
            t = t.slice(0, 27).trim() + "...";
          }
          setTitle(t);
        }
      } catch (err) {
        setTitle("Nie znaleziono");
      }
    }
    getTitle();
  }, [id, collection]);

  return title;
}

export const routes = [
  {
    path: "/",
    breadcrumb: "Strona główna",
    children: [
      {
        path: "/catalogues",
        breadcrumb: "Katalogi",
        children: [
          { path: "/catalogues/new", breadcrumb: "Dodaj katalog" },
          {
            path: "/catalogues/:id",
            breadcrumb: null,
            children: [
              { path: "/catalogues/:id/edit", breadcrumb: "Edytuj katalog" },
            ],
          },
        ],
      },
      {
        path: "/books",
        breadcrumb: "Książki",
        children: [
          { path: "/books/new", breadcrumb: "Dodaj pozcyję" },
          {
            path: "/books/:id",
            breadcrumb: null,
            children: [
              { path: "/books/:id/edit", breadcrumb: "Edytuj pozycję" },
            ],
          },
        ],
      },
      { path: "/authors", breadcrumb: "Autorzy" },
      { path: "/search", breadcrumb: "Szukaj" },
      { path: "/*", breadcrumb: "Nie znaleziono" },
    ],
  },
];

export default function Breadcrumbs() {
  const [crumbs, setCrumbs] = useState([]);
  const loc = useLocation();

  useEffect(() => {
    const currCrumbs = [];
    const paths = loc.pathname.split("/").filter(Boolean);
    const len = paths.unshift("/");

    let currPath = "";
    let count = 0;

    const buildCrumbs = (routes) => {
      currPath += paths[count] + (paths[count] === "/" ? "" : "/");
      let route = routes.find((r) =>
        matchPath({ path: r.path, end: true }, currPath)
      );
      if (route) {
        currCrumbs.push({
          breadcrumb:
            route.breadcrumb === null ? (
              <DynamicTitle id={paths[count]} collection={paths[count - 1]} />
            ) : (
              route.breadcrumb
            ),
          pathname: currPath,
        });
        count += 1;
        if (route.children && count < len) {
          buildCrumbs(route.children);
        }
      }
    };

    buildCrumbs(routes);
    setCrumbs(currCrumbs);

    return () => setCrumbs([]);
  }, [loc]);

  return (
    <nav className="breadcrumbs" aria-label="breadcrumbs">
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={crumb.breadcrumb}>
            {index === crumbs.length - 1 ? (
              <Link to={crumb.pathname} aria-current="location">
                {crumb.breadcrumb}
              </Link>
            ) : (
              <Link to={crumb.pathname}>{crumb.breadcrumb}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
