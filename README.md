# TaskPilot Frontend

A modern, responsive, and production-ready frontend for **TaskPilot**, built using **Next.js (App Router)**, **TypeScript**, and a fully component-driven UI.  
This frontend integrates seamlessly with the TaskPilot backend to provide a complete productivity and task-management experience.

---

## 🚀 Features

- **Authentication**
  - Login, Register, Protected routes
  - JWT token handling
- **Role-based UI**
  - User dashboard
  - Admin-specific actions
- **Task Management**
  - Create, update, delete tasks
  - Priority, status, due dates
  - Grid & table views
- **Notes Module**
  - CRUD notes with tags (UI-rich)
- **Projects Module**
  - Project creation & editing
  - Attach tasks to projects
- **User Profile**
  - Update fullname, bio, and avatar
  - Role editing (admin only)
- **Reusable UI Components**
  - Input, Button, Modals, Dropdowns, Cards
- **Validation**
  - React Hook Form + Zod schema validations
- **State & Data Fetching**
  - Axios + Context API for Auth & Toast
- **Fully Responsive**
  - Adaptive layout for mobile, tablet, and desktop
- **Smooth Animations**
  - Motion for page transitions, modals, and UI interactions

---

## 🛠 Tech Stack

- **Next.js 14 (App Router)**
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Zod**
- **React Hook Form**
- **Axios**
- **Motion**
- **Lucide Icons**

---

## 📁 Folder Structure
```
src/
app/
(routes: dashboard, tasks, notes, projects, profile, login, register)
components/
ui/
forms/
modals/
context/
lib/
utils/
styles/
.env.local
```


---

## ⚙️ Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SERVER_URI=
ACCESS_TOKEN_SECRET=
```
Do not store secrets in the frontend repo.
These variables integrate with the backend API and token logic.

▶️ Getting Started
1. Clone & Install
```
git clone <your-frontend-repo>
```
```
cd taskpilot-frontend

npm install
```
2. Run Development Server
```
npm run dev
```
3. Build for Production
```
npm run build
npm start
```
🔌 API Integration
All API calls are organized in:


src/lib/apiClient.ts
Handles:

Authentication

Tasks, Notes, Projects CRUD

Dashboards

Profile updates

Admin operations

Every call uses:

```
NEXT_PUBLIC_SERVER_URI
```
# 🔮 Future Scope
TaskPilot is built for long-term scalability. Planned enhancements include:

🤖 AI-Powered Features
AI task summarization

AI prioritization engine

Smart productivity insights

AI-assisted note creation

Semantic search for tasks & notes

⚡ Functional Upgrades
Real-time sync with Socket.io

Team collaboration

Shared projects

Activity timeline

Custom theming & personalization

#  Acknowledgment
This version of TaskPilot may contain small bugs or incomplete features — improvements and refinements will continue in upcoming releases.
More functionality, better optimizations, and AI features are planned.

 Thank You
Thanks to everyone who contributed to testing, feedback, and shaping TaskPilot into a polished, user-friendly productivity platform.

 Contact
For support, improvements, or suggestions - feel free to open an issue or reach out anytime.

---
