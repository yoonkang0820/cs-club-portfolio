import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import app from "./firebase";

const auth = getAuth(app);

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (user === undefined) return <p style={{ textAlign: "center", marginTop: 100 }}>로딩 중...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
}