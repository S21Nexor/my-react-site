import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "520px",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#0d9488",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  fieldGroup: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.4rem",
    fontSize: "0.95rem",
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
    direction: "rtl",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.82rem",
    marginTop: "0.3rem",
  },
  button: {
    width: "100%",
    padding: "0.85rem",
    background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.05rem",
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
  success: {
    textAlign: "center",
    padding: "2rem",
  },
  successIcon: {
    fontSize: "3.5rem",
    marginBottom: "1rem",
  },
  successTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0d9488",
    marginBottom: "0.75rem",
  },
  successMsg: {
    color: "#6b7280",
    lineHeight: "1.7",
  },
  successBtn: {
    marginTop: "1.5rem",
    padding: "0.7rem 2rem",
    background: "#0d9488",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "'Cairo', sans-serif",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitError: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "#dc2626",
    marginBottom: "1rem",
    fontSize: "0.9rem",
    textAlign: "center",
  },
};

// Saudi phone numbers: must start with 05 followed by exactly 8 digits (10 digits total)
const PHONE_REGEX = /^05\d{8}$/;
// Saudi National ID: exactly 10 digits
const NATIONAL_ID_REGEX = /^\d{10}$/;

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) {
    errors.fullName = "الاسم الكامل مطلوب";
  } else if (form.fullName.trim().length < 3) {
    errors.fullName = "يجب أن يكون الاسم على الأقل 3 أحرف";
  }
  if (!form.nationalId.trim()) {
    errors.nationalId = "رقم الهوية الوطنية مطلوب";
  } else if (!NATIONAL_ID_REGEX.test(form.nationalId.trim())) {
    errors.nationalId = "يجب أن يتكون رقم الهوية من 10 أرقام بالضبط";
  }
  if (!form.phone.trim()) {
    errors.phone = "رقم الجوال مطلوب";
  } else if (!PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
  }
  if (!form.address.trim()) {
    errors.address = "العنوان مطلوب";
  } else if (form.address.trim().length < 10) {
    errors.address = "يجب أن يكون العنوان على الأقل 10 أحرف";
  }
  return errors;
}

const initialForm = { fullName: "", nationalId: "", phone: "", address: "" };

export default function PublicRegistration() {
  useEffect(() => {
  addDoc(collection(db, "visitors"), {
    online: true,
    createdDate: serverTimestamp(),
  })
}, [])
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "pays"), {
        fullName: form.fullName.trim(),
        nationalId: form.nationalId.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        createdAt: serverTimestamp(),
        status: "pending",
      });
      setSubmitted(true);
    } catch (err) {
      if (err.code === "permission-denied") {
        setSubmitError("لا توجد صلاحية لإرسال الطلب. يرجى التواصل مع الدعم.");
      } else if (err.code === "unavailable" || err.message?.includes("network")) {
        setSubmitError("تعذّر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
      } else {
        setSubmitError("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
      }
      console.error("Firestore addDoc error:", err.code, err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
    setSubmitError("");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {submitted ? (
          <div style={styles.success}>
            <div style={styles.successIcon}>✅</div>
            <div style={styles.successTitle}>تم التسجيل بنجاح!</div>
            <p style={styles.successMsg}>
              شكراً لك. تم استلام طلبك وسيتم مراجعته في أقرب وقت ممكن.
            </p>
            <button style={styles.successBtn} onClick={handleReset}>
              تسجيل جديد
            </button>
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <div style={styles.title}>نموذج تسجيل</div>
              <div style={styles.subtitle}>يرجى ملء جميع الحقول المطلوبة</div>
            </div>

            {submitError && <div style={styles.submitError}>{submitError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="fullName">
                  الاسم الكامل <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                  style={{
                    ...styles.input,
                    ...(errors.fullName ? styles.inputError : {}),
                  }}
                />
                {errors.fullName && (
                  <div style={styles.errorText}>{errors.fullName}</div>
                )}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="nationalId">
                  رقم الهوية الوطنية <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="nationalId"
                  name="nationalId"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.nationalId}
                  onChange={handleChange}
                  placeholder="10 أرقام"
                  style={{
                    ...styles.input,
                    ...(errors.nationalId ? styles.inputError : {}),
                  }}
                />
                {errors.nationalId && (
                  <div style={styles.errorText}>{errors.nationalId}</div>
                )}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="phone">
                  رقم الجوال <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="05XXXXXXXX"
                  style={{
                    ...styles.input,
                    ...(errors.phone ? styles.inputError : {}),
                  }}
                />
                {errors.phone && (
                  <div style={styles.errorText}>{errors.phone}</div>
                )}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="address">
                  العنوان <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="أدخل عنوانك الكامل"
                  style={{
                    ...styles.input,
                    resize: "vertical",
                    ...(errors.address ? styles.inputError : {}),
                  }}
                />
                {errors.address && (
                  <div style={styles.errorText}>{errors.address}</div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(submitting ? styles.buttonDisabled : {}),
                }}
                disabled={submitting}
              >
                {submitting ? "جارٍ الإرسال..." : "إرسال الطلب"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
