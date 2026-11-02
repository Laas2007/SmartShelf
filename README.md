# DigiLibrary — Full-Stack College Library Management System

> **Campus Digital Library Portal** designed for modern academic libraries. Featuring multi-role access (Student, Librarian, Admin), real-time catalog search, physical shelf location tracking, circulation desk operations, fine ledgers, hold requests, and curriculum-based recommendations.

*Note: This repository is currently named `SmartShelf` and will be renamed to `DigiLibrary` by the team lead.*

---

## 🚀 Live Demo & Deployment

- **Production URL**: Deployed on [Netlify](https://www.netlify.com/).
- **Current Architecture**: Interactive Client-Side Prototype powered by React, TypeScript, and Tailwind CSS with local mock data services.
- **Repository**: [https://github.com/Laas2007/SmartShelf](https://github.com/Laas2007/SmartShelf)

---

## ✨ Features by Role

### 1. 🎓 Student Portal
- **Role Authentication**: Sign in using College USN and Library Card ID. Includes multiple pre-configured student accounts to test varied borrowing histories and fine statuses.
- **Personalized Dashboard**: Displays authenticated student name, USN, Library ID, department, semester, and borrow quota (up to 4 books).
- **Catalog Search & Filtering**: Instant search across titles, authors, ISBNs, and call numbers. Filter by engineering/science department or toggle "In-Stock Only".
- **Physical Shelf Locator**: Every book displays exact physical shelf coordinates:
  - *Floor Number* (e.g., Floor 1, Floor 2, Floor 3)
  - *Wing / Section* (e.g., North Wing - CSE, East Wing - AI)
  - *Rack ID* (e.g., Rack CS-02, Rack AI-01)
  - *Shelf Tier* (e.g., Tier B - Eye Level)
  - *Library Call Number* (e.g., `QA76.6 .C66 2022`)
- **My Loans & Due Dates**: Countdown to due dates, overdue alert badges, and simulated return workflows.
- **Overdue Fines**: Calculates overdue fines at ₹5.00/day for late books, with a "Pay Fine" action that generates a settled payment receipt.
- **Reservations & Holds**: Waitlist queue tracking with a 3-day pickup reservation window when copies become available.
- **Curriculum-Based Recommendations**: Recommends relevant syllabus textbooks based on the student's department and unborrowed catalog titles.
- **Notification Center**: In-app notifications for hold readiness, return deadlines, and fee notices.

### 2. 📚 Librarian Portal
- **Circulation Desk**:
  - **Issue Books**: Select student by USN / Library Card ID and issue textbooks with standard 14-day loan terms.
  - **Return Desk**: One-click return processing to restore available copies back to shelf inventory.
- **Student Records Directory**: Search student accounts to inspect active checkouts, return history, and borrowing limit status.
- **Reservations & Waitlists**: Fulfill, monitor, or cancel student hold requests.
- **Fine Management Desk**: Complete overdue ledger across the student body with options to **Collect Payment** or **Waive Fine**.
- **Physical Inventory Tracker**: Real-time shelf inventory monitoring.

### 3. 🛡️ Admin Portal
- **Institutional Analytics**: KPIs for total catalog volume, books currently circulating, overdue return rates, and unsettled fines.
- **Catalog & Shelf Management**: Add new books, update physical shelf coordinates (Floor, Wing, Rack, Shelf, Call Number), or delete titles.
- **Student Directory**: Register new student accounts and manage borrowing limits.
- **Librarian Staff Management**: Track authorized circulation desk staff, shifts, and assigned library zones.
- **Building & Floor Layouts**: Structural view of floors, wings, rack prefixes, and volume storage capacities.

---

## 🛠️ Technology Stack

### Current Implementation (Frontend Prototype)
- **Framework**: React 18 (`react`, `react-dom`)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4 + PostCSS + Autoprefixer
- **Build Tool & Dev Server**: Vite 6.0
- **Icons**: Lucide React (`lucide-react`)
- **Client Storage Layer**: Browser `localStorage` service (`storageService.ts`) providing persistent CRUD operations across page reloads.

### Planned Architecture (Full-Stack Roadmap)
- **Backend**: Node.js & Express (`backend/`)
- **Database**: PostgreSQL (`database/`)
- **AI Recommendation Service**: Vector search & recommendation pipeline (`ai-service/`)

---

## 📂 Project Structure

```text
SmartShelf/                          # Repository root (to be renamed DigiLibrary)
├── .gitignore                       # Repository-level ignore rules
├── netlify.toml                     # Netlify build & SPA routing configuration
├── README.md                        # Project documentation
│
├── frontend/                        # React + TypeScript + Tailwind application
│   ├── index.html                   # Entry HTML with DigiLibrary title & icon
│   ├── package.json                 # Dependencies and scripts
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript project references
│   ├── tailwind.config.js           # Tailwind theme and brand tokens
│   └── src/
│       ├── main.tsx                 # React DOM mount point
│       ├── App.tsx                  # Root component & role-based routing
│       ├── index.css                # Global Tailwind styles
│       ├── types/
│       │   └── library.ts           # Domain models (Book, Loan, ShelfLocation, User)
│       ├── data/
│       │   └── mockData.ts          # Sample academic books, students, staff, locations
│       ├── services/
│       │   └── storageService.ts    # Stateful localStorage service & recommendations
│       └── components/
│           ├── AuthScreen.tsx       # Multi-role authentication & registration modal
│           ├── Navbar.tsx           # Navigation bar, notifications, and logout
│           ├── StudentCatalog.tsx   # Search, filters, recommendations & book cards
│           ├── BookModal.tsx        # Book details & exact shelf locator drawer
│           ├── ShelfBadge.tsx       # Visual physical rack & floor indicator
│           ├── MyLoansView.tsx      # Active checkouts, due dates, and fine payment
│           ├── ReservationsView.tsx # Hold requests & waitlist status
│           ├── LibrarianPortal.tsx  # Circulation desk, student lookup, fine ledger
│           ├── AdminPortal.tsx      # Analytics, book/shelf manager, user directory
│           └── Toast.tsx            # Action notifications
│
├── backend/                         # Node.js + Express backend (scaffold)
│   └── README.md
├── database/                        # PostgreSQL schema & migrations (scaffold)
│   └── README.md
├── ai-service/                      # AI recommendation engine (scaffold)
│   └── README.md
└── documentation/                   # Architecture diagrams & specifications
    └── README.md
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v20+ LTS (Tested on v26.x)
- **npm**: v10+ (Tested on v11.x)

### Running the Frontend
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
cd frontend
npm run build
```
This executes `tsc -b` (TypeScript verification) and compiles the production bundle into `frontend/dist/`.

---

## 🌐 Netlify Deployment

The project includes a root `netlify.toml` configured for monorepo SPA deployment:

```toml
[build]
  base = "frontend"
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- **Base Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `frontend/dist`
- **SPA Rewrite**: Routes all requests to `/index.html` with HTTP 200 to enable client-side navigation.

---

## 🔒 Security & Environment Notes

- This prototype uses simulated client-side authentication for demonstration purposes.
- No real credentials, private tokens, or secrets are required to run the frontend.
- When backend integration begins:
  - Create a `.env` file inside `backend/` using `backend/.env.example`.
  - Required variables will include: `PORT`, `DATABASE_URL`, `JWT_SECRET`.
  - Never commit `.env` files to source control (handled by `.gitignore`).

---

## 🤝 Team Collaboration

- **Repository**: [https://github.com/Laas2007/SmartShelf](https://github.com/Laas2007/SmartShelf)
- **Repository Renaming**:
  - The repository owner (`Laas2007`) can rename the repository to `DigiLibrary` via **GitHub Repository Settings** -> **General** -> **Repository name**.
  - GitHub will automatically redirect existing remotes. Collaborators can update their remote URL with:
    ```bash
    git remote set-url origin https://github.com/Laas2007/DigiLibrary.git
    ```
