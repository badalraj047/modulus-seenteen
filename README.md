# To-Do App — React Native (TypeScript) + Node.js/Express + MongoDB

A full-stack mobile To-Do application with user authentication.

- **Frontend:** React Native CLI, TypeScript, React Navigation, Context + useReducer for state
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT authentication with bcrypt-hashed passwords

---

## Project Structure

```
todo-app/
├── backend/          # Node.js + Express + MongoDB REST API
└── frontend/         # React Native CLI app (Android)
```

---

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/todo_app
JWT_SECRET=<put a long random string here>
JWT_EXPIRES_IN=7d
PORT=5000
```

You need a MongoDB instance running — either:
- **Local:** install MongoDB Community Server and run `mongod`, or
- **Cloud:** create a free cluster on MongoDB Atlas and paste its connection string into `MONGO_URI`.

Start the server:

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

You should see:
```
MongoDB connected: ...
Server running on port 5000
```

Verify it's alive: open `http://localhost:5000/api/health` in a browser — it should return `{"status":"ok", ...}`.

### API Endpoints

| Method | Endpoint              | Auth | Description                    |
|--------|-----------------------|------|--------------------------------|
| POST   | /api/auth/register    | No   | Register (name, email, password) |
| POST   | /api/auth/login       | No   | Login (email, password)        |
| GET    | /api/auth/me          | Yes  | Get current user profile       |
| GET    | /api/tasks            | Yes  | List tasks (`?sortBy=smart\|deadline\|priority`, `?completed=true\|false`, `?priority=low\|medium\|high`) |
| POST   | /api/tasks            | Yes  | Create task                    |
| PUT    | /api/tasks/:id        | Yes  | Update task                    |
| PATCH  | /api/tasks/:id/toggle | Yes  | Toggle completed status        |
| DELETE | /api/tasks/:id        | Yes  | Delete task                    |

Authenticated requests need header: `Authorization: Bearer <token>`.

---

## 2. Frontend Setup

Make sure your machine has the standard React Native Android setup done (Node.js, JDK 17, Android Studio + SDK, an emulator or a device with USB debugging on). If you haven't done this before, follow the official guide first: https://reactnative.dev/docs/set-up-your-environment (select **React Native CLI**, **Android**).

```bash
cd frontend
npm install
```

### Point the app at your backend

Open `src/api/config.ts`:

```ts
export const API_BASE_URL = 'http://10.0.2.2:5000/api';
```

- **Android emulator** (default, already set): `10.0.2.2` is the special alias emulators use to reach your computer's `localhost`. No change needed if you're running the backend on the same machine as the emulator.
- **Physical Android device:** replace `10.0.2.2` with your computer's LAN IP address (e.g. `http://192.168.1.5:5000/api`). Find it with `ipconfig` (Windows) or `ifconfig`/`ip addr` (Mac/Linux). Your phone and computer must be on the same Wi-Fi network.
- **Deployed backend:** paste the public URL (e.g. Render/Railway) instead.

### Run the app

```bash
# Terminal 1: start Metro bundler
npm start

# Terminal 2: build and launch on Android
npm run android
```

This installs a debug build on your running emulator/connected device.

---

## 3. Using the App

1. **Register** with a name, email, and password (min 6 characters).
2. You're logged in automatically after registering, and stay logged in across app restarts (session is saved on-device).
3. Tap **+** to add a task: title, optional description, date & time, deadline, and priority (low/medium/high).
4. Tap a task to edit it, tap the circle to mark complete, tap ✕ to delete.
5. Use the filter chips (All / Active / Completed) and sort chips (Smart / Deadline / Priority) at the top.
6. **Smart sort** blends priority and time-to-deadline: a high-priority task due soon will outrank a low-priority task even if its deadline is technically further away — see `smartScore()` in `backend/src/controllers/taskController.js`.
7. **Log Out** from the top-right of the task list.

---

## Design & Architecture Notes

- **Auth:** custom JWT-based authentication (per the assignment's "implement a basic authentication system" option). Passwords are hashed with bcrypt before being stored; the JWT signing secret lives in `.env` and is never committed.
- **State management:** React Context + `useReducer` (per the assignment's "React's built-in state" option) — one context for auth, one for tasks, avoiding prop-drilling without adding Redux.
- **Data isolation:** every task is scoped to `req.user._id` on the backend; one user can never read, edit, or delete another user's tasks (enforced server-side, not just hidden in the UI).
- **Validation:** both client-side (fast feedback) and server-side (`express-validator`, source of truth) validation on register/login/task forms.
- **No third-party UI/icon libraries** were used for icons — simple text/Unicode symbols instead — to minimize native-linking surface area and keep the Android build reliable out of the box.

---

## Troubleshooting

- **"Could not reach the server"** — confirm the backend is running and `API_BASE_URL` in `src/api/config.ts` matches how your device/emulator can reach your computer (see above).
- **MongoDB connection error on backend startup** — check `MONGO_URI` in `backend/.env` and that MongoDB is actually running.
- **Gradle/Android build issues** — make sure `ANDROID_HOME` and `JAVA_HOME` are set correctly per the official React Native environment setup guide linked above.
