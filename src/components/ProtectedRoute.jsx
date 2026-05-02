import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthState(user ? "authenticated" : "unauthenticated");
    });
    return () => unsub();
  }, []);

  if (authState === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Cairo', sans-serif",
          color: "#6b7280",
          fontSize: "1rem",
        }}
      >
        جارٍ التحقق...
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
