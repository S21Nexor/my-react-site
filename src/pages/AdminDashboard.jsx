import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f4f8",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
  },
  header: {
    background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
    color: "#fff",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: "1.4rem",
    fontWeight: "700",
  },
  headerSub: {
    fontSize: "0.85rem",
    opacity: 0.8,
    marginTop: "0.15rem",
  },
  logoutBtn: {
    padding: "0.5rem 1.25rem",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    color: "#fff",
    fontFamily: "'Cairo', sans-serif",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  main: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  statsRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.25rem 1.75rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    minWidth: "160px",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "0.85rem",
    marginBottom: "0.4rem",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1d4ed8",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: "700",
    fontSize: "1.05rem",
    color: "#1f2937",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  th: {
    padding: "0.85rem 1rem",
    background: "#f8fafc",
    textAlign: "right",
    fontWeight: "700",
    color: "#374151",
    borderBottom: "2px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "0.85rem 1rem",
    borderBottom: "1px solid #f3f4f6",
    color: "#4b5563",
    textAlign: "right",
  },
  trHover: {
    background: "#f9fafb",
  },
  statusBadge: {
    padding: "0.2rem 0.65rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "600",
    display: "inline-block",
  },
  statusPending: {
    background: "#fef3c7",
    color: "#92400e",
  },
  statusApproved: {
    background: "#d1fae5",
    color: "#065f46",
  },
  statusRejected: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  emptyMsg: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#9ca3af",
    fontSize: "1rem",
  },
  loading: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#6b7280",
  },
};

function statusLabel(status) {
  const map = {
    pending: "قيد الانتظار",
    approved: "مقبول",
    rejected: "مرفوض",
  };
  return map[status] || status;
}

function statusStyle(status) {
  if (status === "approved") return styles.statusApproved;
  if (status === "rejected") return styles.statusRejected;
  return styles.statusPending;
}

function formatDate(ts) {
  if (!ts) return "-";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "registrations"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setRegistrations(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    navigate("/admin");
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerTitle}>لوحة تحكم الإدارة</span>
          <span style={styles.headerSub}>Admin Dashboard</span>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          تسجيل الخروج
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>إجمالي الطلبات</span>
            <span style={styles.statValue}>{registrations.length}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>قيد الانتظار</span>
            <span style={{ ...styles.statValue, color: "#d97706" }}>
              {registrations.filter((r) => r.status === "pending").length}
            </span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>مقبول</span>
            <span style={{ ...styles.statValue, color: "#059669" }}>
              {registrations.filter((r) => r.status === "approved").length}
            </span>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>قائمة التسجيلات</div>
          <div style={styles.tableWrapper}>
            {loading ? (
              <div style={styles.loading}>جارٍ تحميل البيانات...</div>
            ) : registrations.length === 0 ? (
              <div style={styles.emptyMsg}>لا توجد تسجيلات حتى الآن</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>الاسم الكامل</th>
                    <th style={styles.th}>رقم الهوية</th>
                    <th style={styles.th}>رقم الجوال</th>
                    <th style={styles.th}>العنوان</th>
                    <th style={styles.th}>تاريخ التسجيل</th>
                    <th style={styles.th}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id}>
                      <td style={styles.td}>{reg.fullName}</td>
                      <td style={styles.td}>{reg.nationalId}</td>
                      <td style={styles.td}>{reg.phone}</td>
                      <td style={styles.td}>{reg.address}</td>
                      <td style={styles.td}>{formatDate(reg.createdAt)}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...statusStyle(reg.status),
                          }}
                        >
                          {statusLabel(reg.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
