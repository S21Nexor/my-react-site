# نموذج تسجيل عام + لوحة تحكم إدارية
# Public Registration Form + Admin Dashboard

A full-stack Arabic RTL registration system with a public form and an admin dashboard, powered by React + Firebase.

---

## Pages / الصفحات

| URL | Description |
|-----|-------------|
| `/` | Public Arabic RTL registration form (نموذج التسجيل العام) |
| `/admin` | Admin login page |
| `/admin/dashboard` | Admin dashboard (protected, requires login) |

---

## Quick Start / إعداد المشروع

### 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** and follow the steps.
3. In the project, click **⚙️ Project Settings** → **Your apps** → add a **Web app**.
4. Copy the `firebaseConfig` object shown.

### 2. Enable Firestore

1. In the Firebase console, go to **Firestore Database** → **Create database**.
2. Start in **Test mode** (or set up security rules as needed).

### 3. Enable Authentication

1. Go to **Authentication** → **Sign-in method** → enable **Email/Password**.
2. Go to **Users** tab → **Add user** → enter the admin email and a strong password (at least 8 characters, mixing letters, numbers, and symbols).

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Firebase config values:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Install & Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

### Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [https://vercel.com](https://vercel.com) and import the repository.
3. In **Environment Variables**, add all six `VITE_FIREBASE_*` values from your `.env`.
4. Click **Deploy**.

The `vercel.json` file already included in this repo configures SPA rewrites so that `/admin` and `/admin/dashboard` are handled by React Router instead of returning 404.

### Deploy to Firebase Hosting (optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # public dir: dist, SPA: yes
npm run build
firebase deploy
```

---

## Project Structure

```
src/
├── firebase.js                 # Firebase initialization
├── main.jsx                    # App entry point
├── App.jsx                     # Router (/, /admin, /admin/dashboard)
├── components/
│   └── ProtectedRoute.jsx      # Auth guard for dashboard
└── pages/
    ├── PublicRegistration.jsx  # Arabic RTL registration form
    ├── AdminLogin.jsx          # Admin login page
    └── AdminDashboard.jsx      # Real-time registrations table
```

---

## Data Flow / تدفق البيانات

1. A visitor fills out the public form at `/`
2. On submit, the data is saved to Firestore collection `registrations`
3. The dashboard at `/admin/dashboard` listens to the same collection in real-time (using `onSnapshot`)
4. New registrations appear **immediately** in the dashboard without refresh

### Firestore Document Schema

```json
{
  "fullName":   "محمد علي",
  "nationalId": "1234567890",
  "phone":      "0512345678",
  "address":    "الرياض، حي النزهة، شارع الملك فهد",
  "createdAt":  "<Firestore Timestamp>",
  "status":     "pending"
}
```

---

## Validation Rules / قواعد التحقق

| Field | Rule |
|-------|------|
| الاسم الكامل (Full Name) | Required, min 3 characters |
| رقم الهوية (National ID) | Required, exactly 10 digits |
| رقم الجوال (Phone) | Required, Saudi format: starts with `05`, 10 digits |
| العنوان (Address) | Required, min 10 characters |

---

## Security Notes

- Never commit your `.env` file (it is gitignored).
- Set proper Firestore security rules in production to restrict public writes to the `registrations` collection only.
- The admin dashboard is protected client-side; always enforce rules server-side via Firebase Security Rules.
