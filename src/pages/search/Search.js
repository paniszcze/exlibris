import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

import "./Search.css";

import SearchResult from "./SearchResult";
import Filter from "../../components/Filter";
import LoadingSpinner from "../../components/LoadingSpinner";

import { searchFilters, cleanRegex } from "../../utils/search";

export default function Search() {
  // Context and router hooks
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const loc = useLocation();

  // Firestore hooks
  const { document: indexList } = useDocument("index", user.uid);

  // SEARCH
  // filter
  const [filter, setFilter] = useState(
    /^\?(all|author|title|series|tag|publisher)=/.test(loc.search)
      ? loc.search.match(/^\?(all|author|title|series|tag|publisher)=/)[1]
      : "all"
  );
  // query
  const [query, setQuery] = useState("");
  useEffect(() => {
    const regex = /^\?([^=]+)=/;
    let q = null;
    if (regex.test(loc.search)) {
      q = new URLSearchParams(loc.search).get(loc.search.match(regex)[1]);
    }
    setQuery(q ? q : "");
  }, [filter, loc]);
  // filtered results
  const [results, setResults] = useState(null);
  useEffect(() => {
    if (indexList && query) {
      setResults(
        Object.values(indexList.books)
          .filter((book) => {
            const regex = cleanRegex(query);
            switch (filter) {
              case "title":
                return regex.test(book.title + book.subtitle);
              case "publisher":
                return regex.test(book.publisher);
              case "tag":
                return book.tags.some((tag) => regex.test(tag));
              case "series":
                return book.series.some((s) => regex.test(s));
              case "author":
                return [
                  ...book.authors,
                  ...book.translators,
                  ...book.editors,
                ].some((s) => regex.test(s));
              case "all":
              default:
                return (
                  regex.test(book.description) ||
                  book.tags.some((tag) => regex.test(tag)) ||
                  [...book.authors, ...book.translators, ...book.editors].some(
                    (s) => regex.test(s)
                  )
                );
            }
          })
          .sort((a, b) =>
            new Intl.Collator("pl").compare(a.description, b.description)
          )
      );
    }
  }, [indexList, filter, query]);
  // search input
  const [input, setInput] = useState("");

  // Button handler
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?${filter ? filter : "all"}=${input.trim()}`);
  };

  return (
    <div className="search">
      <h2 className="page-title">Wyszukiwarka</h2>
      <form onSubmit={handleSubmit}>
        <input
          id="search"
          type="text"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Wpisz wyszukiwaną frazę"
          value={input}
        />
        <button className="btn" type="submit">
          Szukaj
        </button>
      </form>
      <Filter
        currFilter={filter}
        changeFilter={setFilter}
        filters={searchFilters}
      />
      {query && (
        <div className="results">
          {results ? (
            results.length > 0 ? (
              <>
                <h3>
                  Wyniki dla: <span className="query">{query}</span>{" "}
                  {filter && filter !== "all" && (
                    <span>{`[${
                      searchFilters.find((item) => item.value === filter).label
                    }]`}</span>
                  )}{" "}
                  ({results.length})
                </h3>
                {results.map((book) => (
                  <SearchResult key={book.id} query={query} result={book} />
                ))}
              </>
            ) : (
              <h3>
                Brak wyników dla: <span className="query">{query}</span>{" "}
                {filter && filter !== "all" && (
                  <span>{`[${
                    searchFilters.find((item) => item.value === filter).label
                  }]`}</span>
                )}
              </h3>
            )
          ) : (
            <LoadingSpinner />
          )}
        </div>
      )}
    </div>
  );
}
