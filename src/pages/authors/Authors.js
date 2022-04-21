import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

import "./Authors.css";

import { shiftLastName, unshiftLastName } from "../../utils/description";

export default function Authors() {
  const { user } = useAuthContext();
  const { document: authorList } = useDocument("authors", user.uid);
  const [authors, setAuthors] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (authorList) {
      setAuthors(
        Object.keys(authorList.authors).reduce((prev, curr) => {
          if (authorList.authors[curr] > 0) {
            const name = unshiftLastName(curr);
            prev.push(name);
          }
          return prev;
        }, [])
      );
    }
    return () => setAuthors([]);
  }, [authorList]);

  return (
    <div className="authors">
      <h2 className="page-title">Indeks nazwisk</h2>
      <div className="authors-list">
        <input
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Zacznij pisać, żeby przefiltrować wyniki"
        />
        {!authorList ? (
          <p className="info">Wczytywanie...</p>
        ) : (
          <ul>
            {authors.length > 0 ? (
              authors
                .filter((name) => {
                  let reg = new RegExp(input.trim(), "gi");
                  return reg.test(name);
                })
                .sort(new Intl.Collator("pl").compare)
                .map((name, index) => (
                  <li key={index}>
                    <Link
                      to={`/search?author=${shiftLastName(name).toLowerCase()}`}
                    >
                      {name}
                    </Link>
                  </li>
                ))
            ) : (
              <p className="info">Brak autorów do wyświetlenia</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
