import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const useDocument = (c, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, c, id),
      (snapshot) => {
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError("Nie znaleziono danych");
        }
      },
      (err) => {
        console.log(err.message);
        setError("Błąd pobierania danych");
      }
    );

    return () => unsubscribe();
  }, [c, id]);

  return { document, error };
};
