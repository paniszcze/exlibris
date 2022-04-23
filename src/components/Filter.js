import "./Filter.css";

export default function Filter({ currFilter, filters, changeFilter }) {
  return (
    <div className="filter">
      <nav>
        <p>Filtruj:</p>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => changeFilter(filter.value)}
            className={currFilter === filter.value ? "active" : ""}
          >
            {filter.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
