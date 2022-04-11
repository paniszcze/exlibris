import { useState } from "react";

import TrashIcon from "../../assets/delete_icon.svg";

import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";

import { translateDate } from "../../utils/date";

export default function BookNotes({ notes, bookId }) {
  const { updateDocument, response } = useFirestore("books");
  const [newNote, setNewNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      const noteToAdd = {
        content: newNote,
        createdAt: Timestamp.fromDate(new Date()),
        id: Math.random(),
      };
      await updateDocument(bookId, {
        notes: [...notes, noteToAdd],
      });
      if (!response.error) {
        setNewNote("");
      }
    }
  };

  const handleDelete = async (id) => {
    let updatedNotes = notes.filter((item) => item.id !== id);
    await updateDocument(bookId, {
      notes: updatedNotes,
    });
  };

  return (
    <div className="book-notes">
      <h4>Notatki</h4>
      <ul>
        {notes.length > 0 &&
          notes.map((note) => (
            <li key={note.id}>
              <button className="delete" onClick={() => handleDelete(note.id)}>
                <img src={TrashIcon} alt="delete icon" />
              </button>
              <div className="note-date">
                <p>{translateDate(note.createdAt.toDate().toString())}</p>
              </div>
              <div className="note-content">
                <p>{note.content}</p>
              </div>
            </li>
          ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Dodaj nową notatkę:</span>
          <textarea
            required
            onChange={(e) => setNewNote(e.target.value)}
            value={newNote}
          ></textarea>
        </label>
        <button className="btn">Dodaj</button>
      </form>
    </div>
  );
}
