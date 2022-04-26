import { Link } from "react-router-dom";

import "./SearchResult.css";
import RightArrow from "../../assets/right_icon.svg";

import { highlightMatch } from "../../utils/search";

export default function SearchResult({ query, result }) {
  return (
    <Link className="result" to={`/books/${result.id}`}>
      <div className="result-details">
        <h4>
          {result.title}{" "}
          {result.record && (
            <span className="record">{`(${result.record})`}</span>
          )}
        </h4>
        <p className={result.isDisposed ? "disposed" : ""}>
          {highlightMatch(result.description, query)}
        </p>
        {result.tags.length > 0 && (
          <div className="tags">
            {result.tags.map((tag) => (
              <em key={tag}>{tag}</em>
            ))}
          </div>
        )}
      </div>
      <div className="arrow">
        <img src={RightArrow} alt="go to book page" />
      </div>
    </Link>
  );
}
