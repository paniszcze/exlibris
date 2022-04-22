import "./BookDescription.css";

export default function BookDescription({ description }) {
  return (
    <div className="book-description">
      <h3>Opis bibliograficzny</h3>
      <textarea id="description" defaultValue={description}></textarea>
      <button
        className="btn"
        onClick={() => {
          let id = document.getElementById("description");
          id.focus();
          id.select();
        }}
      >
        Zaznacz tekst
      </button>
    </div>
  );
}
