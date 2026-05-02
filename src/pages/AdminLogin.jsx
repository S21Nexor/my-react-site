import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f4f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    fontFamily: "'Cairo', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "420px",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  icon: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  fieldGroup: {
    marginBottom: "1.2rem",
  },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.4rem",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "'Cairo', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "0.85rem",
    background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "700",
    fontFamily: "'Cairo', sans-serif",
    cursor: "pointer",
    marginTop: "0.5rem",
    transition: "opacity 0.2s",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
  },
  errorAr: {
    color: "#dc2626",
    fontSize: "0.9rem",
    direction: "rtl",
    textAlign: "right",
    fontFamily: "'Cairo', sans-serif",
  },
  errorEn: {
    color: "#dc2626",
    fontSize: "0.85rem",
    marginTop: "0.25rem",
  },
  backLink: {
    textAlign: "center",
    marginTop: "1.25rem",
  },
  link: {
    color: "#1d4ed8",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontFamily: "'Cairo', sans-serif",
  },
};

function getErrorMessages(code) {
  const map = {
    "auth/invalid-email": {
      ar: "البريد الإلكتروني غير صالح",
      en: "Invalid email address",
    },
    "auth/user-not-found": {
      ar: "المستخدم غير موجود",
      en: "User not found",
    },
    "auth/wrong-password": {
      ar: "كلمة المرور غير صحيحة",
      en: "Incorrect password",
    },
    "auth/invalid-credential": {
      ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      en: "Invalid email or password",
    },
    "auth/too-many-requests": {
      ar: "تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة لاحقاً",
      en: "Too many failed attempts. Please try again later.",
    },
  };
  return (
    map[code] || {
      ar: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
      en: "An unexpected error occurred. Please try again.",
    }
  );
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(getErrorMessages(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🔐</div>
          <div style={styles.title}>Admin Login</div>
          <div style={styles.subtitle}>تسجيل دخول المشرف</div>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorAr}>{error.ar}</div>
            <div style={styles.errorEn}>{error.en}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={styles.input}
              required
              autoComplete="email"
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.backLink}>
          <a href="/" style={styles.link}>
            ← العودة إلى صفحة التسجيل
          </a>
        </div>
      </div>
    </div>
  );
}
