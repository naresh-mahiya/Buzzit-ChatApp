# 🚀 Buzzit – Full‑Stack Realtime Chat Application

Modern, fast, and role‑aware messaging app built with the MERN stack and Socket.io. Includes a complete Admin Dashboard for user management, secure JWT auth, file sharing, online presence, and a clean, responsive UI.

![Buzzit Screenshot](frontend/public/screenshot-for-readme.png)

---

## ✨ Highlights

- Realtime 1:1 messaging with Socket.io (images, videos, and documents)
- Role‑based authentication (User/Admin) via JWT (httpOnly cookies)
- Admin Dashboard with full user CRUD (create, read, search, update, delete)
- Online users presence and live updates
- Modern, accessible UI with TailwindCSS + DaisyUI
- Global state management with Zustand
- Soft delete support (mark users inactive) and hard delete option (admin)
- Production‑ready Express server serving frontend (Vite build)
- Cloudinary uploads via Multer for media attachments

---

## 🧰 Tech Stack

- **Frontend**: React 18, Vite, Zustand, TailwindCSS, DaisyUI, React Router, Lucide Icons
- **Backend**: Node.js, Express.js, Socket.io
- **Auth**: JWT (httpOnly cookies), bcrypt password hashing
- **Database**: MongoDB + Mongoose
- **Storage**: Cloudinary (images, videos, files)
- **Build/Tooling**: Vite, ESLint

---

## 📦 Project Structure

```
fullstack-chat-app/
  backend/
    src/
      controllers/
        auth.controller.js        # Signup, login, logout, profile update, auth check
        message.controller.js     # Users for sidebar, message fetch/send
        admin.controller.js       # Admin: user CRUD (create/read/update/delete)
      middleware/
        auth.middleware.js        # protectRoute (JWT auth)
        admin.middleware.js       # requireAdmin (RBAC)
      models/
        user.model.js             # User schema (role, isActive, etc.)
        message.model.js          # Message schema (text, file, image/video)
      routes/
        auth.route.js             # /api/auth
        message.route.js          # /api/messages
        admin.route.js            # /api/admin (protected by admin)
      lib/
        db.js                     # Mongoose connection
        socket.js                 # Socket.io server + online presence
        cloudinary.js             # Cloudinary config
        utils.js                  # JWT cookie helpers
      seeds/
        admin.seed.js             # Creates default admin (email + password)
        user.seed.js              # Optional user seed (if present)
    package.json

  frontend/
    src/
      components/
        Navbar.jsx                # App navigation (role-aware)
        Sidebar.jsx               # Contacts list (admins hidden for users)
        ChatContainer.jsx         # Message list + bubbles + attachments
        ChatHeader.jsx            # Selected user info
        MessageInput.jsx          # Composer + attachments
        NoChatSelected.jsx        # Placeholder when no chat selected
        skeletons/                # Loading skeletons
      pages/
        HomePage.jsx              # Chat layout (users only)
        LoginPage.jsx             # Auth with role toggle (user/admin)
        SignUpPage.jsx            # Signup (users only)
        ProfilePage.jsx           # Profile update (avatar)
        AdminDashboard.jsx        # Admin UI: user CRUD + search
      store/
        useAuthStore.js           # Auth state + socket connection
        useChatStore.js           # Chat state (users/messages)
        useThemeStore.js          # Theme state
      lib/
        axios.js                  # Axios instance (base URL + cookies)
        utils.js                  # Helpers
      constants/
        index.js
    package.json

  README.md
  LICENSE
```

---

## 🔐 Authentication & Authorization

- JWT is issued on login/signup and stored as an httpOnly cookie
- `protectRoute` middleware validates token and attaches `req.user`
- `requireAdmin` middleware enforces `role === 'admin'` for admin routes
- Signup creates regular users (`role: 'user'`); Admins are seeded via script

Login supports selecting role (User/Admin) to ensure correct account type is used.

---

## 👑 Admin Dashboard

Accessible only to admins at `/admin` after login. Features:

- Create users (name, email, mobile, password, role)
- Search/filter users by name/email
- Read list of active users (optionally include inactive via API)
- Update users (name, email, mobile, role)
- Delete users (soft delete by default; hard delete endpoint also available)
- Admins are hidden from regular users’ contact lists
- Admins do not see any chat interface; they are redirected to the dashboard

Seed a default admin quickly:

```bash
cd backend
npm run create-admin
# Default (as configured): admin@buzzit.com / admin123
```

---

## 💬 Realtime Messaging

- Socket.io for realtime communication
- Online users list broadcast to connected clients
- Messages support:
  - Text
  - Images (preview)
  - Videos (inline playback)
  - Documents (links to download)
- Smooth autoscroll to newest message
- Modern bubbles: different colors for sent vs. received

---

## 🧪 Data Models (simplified)

### User
- `fullName: string`
- `email: string (unique)`
- `mobile: string (unique)`
- `password: string (hashed)`
- `profilePic: string`
- `role: 'user' | 'admin'` (default: `user`)
- `isActive: boolean` (default: `true`)
- `timestamps`

### Message
- `senderId: ObjectId(User)`
- `receiverId: ObjectId(User)`
- `text?: string`
- `image?: string`
- `videoUrl?: string`
- `fileUrl?: string`
- `fileType?: string`
- `fileName?: string`
- `timestamps`

---

## 🔌 API Overview

Base URL: `http://localhost:5000/api`

### Auth (`/auth`)
- `POST /signup` – Create account (user role)
- `POST /login` – Login with `{ emailOrMobile, password, role? }`
- `POST /logout` – Clear JWT cookie
- `PUT /update-profile` – Update profile picture (protected)
- `GET /check` – Get current user (protected)

### Messages (`/messages`)
- `GET /users` – Users list for sidebar (excludes admins for regular users)
- `GET /:id` – Fetch messages with a user (protected)
- `POST /send/:id` – Send message with optional file (multipart/form-data)

### Admin (`/admin`) – protected by `protectRoute` + `requireAdmin`
- `POST /users` – Create user
- `GET /users?search=&includeInactive=` – List users (search, filter)
- `GET /users/:userId` – Get one user
- `PUT /users/:userId` – Update user
- `DELETE /users/:userId` – Soft delete user (sets `isActive=false`)
- `DELETE /users/:userId/hard` – Hard delete user

---

## ⚙️ Environment Variables

Create `backend/.env` with:

```env
MONGODB_URI=mongodb://localhost:27017/buzzit
PORT=5000
JWT_SECRET=your_super_secret_jwt_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (optional for media uploads, required if you want images/videos)

### 1) Install dependencies
```bash
# From project root
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment
- Create `backend/.env` (see section above)
- Start MongoDB locally or set an Atlas connection string

### 3) (Optional) Seed default admin
```bash
cd backend
npm run create-admin
# admin@buzzit.com / admin123
```

### 4) Run the app (dev)
```bash
# Terminal 1 – backend
cd backend
npm run dev

# Terminal 2 – frontend
cd frontend
npm run dev
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### 5) Production build
- Frontend build: `cd frontend && npm run build`
- Express serves the `frontend/dist` folder automatically when `NODE_ENV=production`

---

## 🧭 UX & UI

- Clean, eye‑comforting theme with modern colors
- Responsive layout for desktop and mobile
- Distinct message bubble colors (sent vs received)
- File/image/video previews in chat
- Role‑aware navigation: users see chat, admins see dashboard
- Avatars fallback to first letter of name (color‑coded)

---

## 🔒 Security Notes

- JWT in httpOnly cookies (mitigates XSS token theft)
- Passwords hashed with bcrypt
- CORS configured for local dev origin
- Admin routes require role‑based access
- Input validation for auth and admin user management

---

## 🧪 Useful Scripts

```bash
# Backend
npm run dev            # Start dev server with nodemon
npm start              # Start production server
npm run create-admin   # Seed default admin user

# Frontend
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

---

## 🗺️ Roadmap Ideas

- Group chats
- Message read receipts & typing indicators
- Push notifications
- Rich link previews
- Message reactions & replies
- Advanced admin analytics & bulk ops

---

## 📄 License

This project is licensed under the terms of the MIT License. See `LICENSE` for details.

---

## 🙌 Acknowledgements

Inspired by modern messaging UX patterns and the MERN + Socket.io ecosystem. Thanks to the open‑source community for the amazing tools that power Buzzit.
