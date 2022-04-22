import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res) {
        throw new Error("Could not complete signup");
      }

      // update user profile
      await updateProfile(res.user, { displayName });
      await setDoc(doc(db, "users", res.user.uid), {
        bookCount: 0,
        catalogues: [],
      });
      await setDoc(doc(db, "authors", res.user.uid), { authors: {} });
      await setDoc(doc(db, "index", res.user.uid), { books: {} });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });
      if (!isCancelled) {
        setError(null);
        setIsPending(false);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
