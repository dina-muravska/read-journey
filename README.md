# 📚 Read Journey

## 📖 About the Project

Read Journey is a web application designed for tracking personal reading activity and managing a digital book collection. Users can discover recommended books, filter by title or author, build their personal library, set reading goals, and monitor their reading progress in real-time.

---

## 🖼️ Preview

<img width="1280" height="772" alt="image" src="https://github.com/user-attachments/assets/a7e911c0-a6d6-482d-94e2-9f4f8f2851fa" />


---

## 🛠️ Technologies

- **React / Next.js (TypeScript)** — App Router routing and strongly typed component architecture
- **React Query (TanStack Query)** — data-fetching, caching, and server state management
- **Formik & Yup** — form handling, management, and schema-based validation
- **CSS3 / CSS Modules** — custom modular styling without third-party utility frameworks
- **Axios** — HTTP requests
- **iziToast / React Hot Toast** — notification library

###  Project Structure

src/
├── app/              # Next.js App Router (pages, layouts, and route handlers)
│   ├── (auth)/       # Authentication routes (login, register)
│   ├── library/      # Personal library page
│   ├── reading/      # Active reading tracker page
│   ├── layout.tsx    # Root layout & providers (React Query Provider)
│   └── page.tsx      # Home / Recommended books page
├── components/       # UI Components (modals, book cards, filters, header)
├── hooks/            # Custom React hooks & React Query hooks
├── services/         # Axios API instance and request functions
├── types/            # TypeScript interfaces and type definitions
├── styles/           # Standard CSS files / CSS Modules
└── utils/            # Helper functions and constants


## 📦 Installation

1. Clone the repository:
```bash
git clone 
Install dependencies:

Bash
npm install
Set up your environment variables:
Create a .env.local file in the root directory and add the API endpoint:

Bash
npm run dev
Open http://localhost:3000 with your browser to see the result.

## 👨‍💻 Author

**Dina Muravska**

GitHub: https://github.com/dina-muravska

---
