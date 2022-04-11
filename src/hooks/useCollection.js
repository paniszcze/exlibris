import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const useCollection = (c, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    let ref = collection(db, c);

    if (query) {
      ref = ref.where(...query);
    }
    if (orderBy) {
      ref = ref.orderBy(...orderBy);
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("Błąd pobierania danych");
      }
    );

    return () => unsubscribe();
  }, [c, query, orderBy]);

  return { documents, error };
};
