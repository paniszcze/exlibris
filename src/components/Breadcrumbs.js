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
    path: "/exlibris",
    breadcrumb: "Strona główna",
    children: [
      {
        path: "/exlibris/catalogues",
        breadcrumb: "Katalogi",
        children: [
          { path: "/exlibris/catalogues/new", breadcrumb: "Dodaj katalog" },
          {
            path: "/exlibris/catalogues/:id",
            breadcrumb: null,
            children: [
              {
                path: "/exlibris/catalogues/:id/edit",
                breadcrumb: "Edytuj katalog",
              },
            ],
          },
        ],
      },
      {
        path: "/exlibris/books",
        breadcrumb: "Książki",
        children: [
          { path: "/exlibris/books/new", breadcrumb: "Dodaj pozcyję" },
          {
            path: "/exlibris/books/:id",
            breadcrumb: null,
            children: [
              {
                path: "/exlibris/books/:id/edit",
                breadcrumb: "Edytuj pozycję",
              },
            ],
          },
        ],
      },
      { path: "/exlibris/authors", breadcrumb: "Autorzy" },
      { path: "/exlibris/search", breadcrumb: "Szukaj" },
      { path: "/exlibris/*", breadcrumb: "Nie znaleziono" },
    ],
  },
];

export default function Breadcrumbs() {
  const [crumbs, setCrumbs] = useState([]);
  const loc = useLocation();

  useEffect(() => {
    const currCrumbs = [];
    const paths = loc.pathname.split("/").filter(Boolean);
    paths.shift();
    const len = paths.unshift("/");

    let currPath = "/exlibris";
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
