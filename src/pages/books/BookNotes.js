import { useState } from "react";

export default function BookNotes({ notes }) {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("add note:", newNote);
    setNewNote("");
  };

  return (
    <div className="book-notes">
      <h4>Notatki</h4>
      <ul>
        {notes.length > 0 &&
          notes.map((note) => (
            <li key={note.id}>
              <div className="note-date">
                <p>{note.date}</p>
              </div>
              <div className="note-content">
                <p>{note.content}</p>
              </div>
            </li>
          ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Stwórz nową notatkę:</span>
          <textarea
            onChange={(e) => setNewNote(e.target.value)}
            value={newNote}
          ></textarea>
        </label>
        <button className="btn">Dodaj</button>
      </form>
    </div>
  );
}
