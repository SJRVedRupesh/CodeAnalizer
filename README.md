# 🚀 DSA & SQL Code Analyzer

> **Instant Complexity & Structural Intelligence for C++ DSA and Relational SQL Queries**
>
> *Summer Training Project 2026 Presentation Capstone*  
> **Author:** SJR Ved Rupesh  
> **Repository:** [https://github.com/SJRVedRupesh/CodeAnalizer](https://github.com/SJRVedRupesh/CodeAnalizer)

---

## 🌟 Overview & Objectives

**DSA & SQL Code Analyzer** is a modern, responsive, full-stack web application engineered for computer science students, competitive programmers, and database developers. 

Unlike traditional compilers that only report syntax errors or generic outputs, this platform provides **instant structural decomposition, Big-O Time & Space Complexity calculation, SQL logical execution order visualization, live multi-table database sandbox execution, and crystal-clear explanations in simple English**.

---

## ✨ Key Features

### 1. ⚡ C++ DSA Static Analyzer & Execution Engine
- **Algorithmic Paradigm Recognition:** Automatically detects Binary Search, Two Pointer Technique, Sliding Window, Dynamic Programming (Memoization/Tabulation), Recursion & Backtracking, BFS/DFS, Dijkstra, Bit Manipulation, and Sorting algorithms.
- **Big-O Complexity Computation:** Mathematical deduction of Time Complexity ($O(1)$, $O(\log n)$, $O(n)$, $O(n \log n)$, $O(n^2)$, $O(2^n)$, $O(V + E)$) and Space Complexity with speed ratings and clear mathematical rationale.
- **STL Analysis:** Identifies `vector`, `unordered_map`, `map`, `set`, `priority_queue`, `stack`, `queue`, `deque`, `list`, `bitset`, and algorithms like `std::sort`, `binary_search`, `lower_bound`, etc.
- **Structural Metrics:** Measures function signatures, loop counts, loop nesting depths, recursive branching, and variable scopes.
- **Proactive Optimization & Safety Advice:** Detects opportunities for Fast I/O, pass-by-const-reference, $O(1)$ hash map lookup migrations, integer overflow risks, and container boundary checks.
- **Live C++ Runner:** Compiles and executes code with custom standard input (`stdin`) and execution time benchmarking.

---

### 2. 🗄️ SQL Query Analyzer & Live SQLite Engine
- **Deep Query Clause Parser:** Analyzes `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `WITH` (CTEs), Subqueries, and Window Functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`).
- **Join Classifier:** Decomposes `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`, `CROSS JOIN`, and `SELF JOIN` with join predicate validation.
- **Visual Logical Execution Order:** Visualizes the true 8-phase SQL engine evaluation flow:
  $$\text{FROM \& JOIN} \longrightarrow \text{WHERE} \longrightarrow \text{GROUP BY} \longrightarrow \text{HAVING} \longrightarrow \text{SELECT} \longrightarrow \text{DISTINCT} \longrightarrow \text{ORDER BY} \longrightarrow \text{LIMIT}$$
- **Indexing & Normalization Recommendations:** Generates targeted B-Tree indexing suggestions for `WHERE` and `JOIN` foreign keys, flags `SELECT *` anti-patterns, and provides 1NF/2NF/3NF database normalization guidelines.
- **Pre-Seeded Live Databases:** Powered by an embedded SQLite WebAssembly database with multi-table schemas:
  - **Company HR & Payroll** (`employees`, `departments`, `projects`, `employee_projects`)
  - **E-Commerce Store** (`categories`, `products`, `customers`, `orders`)
  - **University Management** (`students`, `courses`, `enrollments`)
- **Interactive Data Table Viewer:** Renders live query results with columns, row counts, and query execution time in milliseconds.

---

### 3. 🎨 User Interface & Experience
- **Monaco Code Editor:** VS Code editor with syntax highlighting, line numbers, customizable font sizes, format code, and clipboard copy.
- **Glassmorphic Theme System:** Dark / Light mode toggle with smooth gradients and glass panel blurs.
- **Algorithm & Query Templates:** Pre-loaded one-click templates for classic algorithms (Binary Search, Two Sum, Merge Sort, BFS, Knapsack DP) and SQL queries (Salary Join, Top Customers, Student GPA Ranking).
- **Interactive Schema Explorer Modal:** Inspect live database schemas, column data types, primary keys, and sample rows.
- **Exportable Markdown Reports:** Download analysis reports for offline review, homework, or presentation submission.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React, React Router 6, Canvas Confetti |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **SQL Engine** | `sql.js` (WebAssembly SQLite Engine) |
| **Database** | MongoDB (with high-performance zero-configuration In-Memory store fallback) |
| **Version Control** | Git & GitHub (`Analyzer` branch) |

---

## 📂 Project Architecture

```
Code-Analyzer/
├── client/                     # Frontend Single Page Application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ComplexityBadge, SchemaExplorerModal
│   │   ├── context/            # ThemeContext (Dark/Light mode)
│   │   ├── pages/              # HomePage, AnalyzerPage, AboutPage
│   │   ├── services/           # Axios API client
│   │   ├── App.jsx             # Router and layout configuration
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Design tokens, glassmorphism, scrollbars
│   ├── index.html              # HTML shell & Google Fonts
│   ├── tailwind.config.js      # Tailwind theme extensions
│   ├── vite.config.js          # Vite build & proxy configuration
│   └── package.json
│
├── server/                     # Backend API & Analysis Engine
│   ├── controllers/            # analyzerController.js, historyController.js
│   ├── models/                 # AnalysisHistory.js
│   ├── routes/                 # analyzerRoutes.js, historyRoutes.js
│   ├── services/               # cppAnalyzer.js, sqlAnalyzer.js, sampleDatabase.js, codeExecutor.js
│   ├── app.js                  # Express middleware & routes
│   ├── server.js               # Server bootstrap & DB initialization
│   ├── test.js                 # Verification test suite
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **g++ / GCC / MinGW**: For native local C++ execution (fallback sandbox is included automatically).

---

### Step 1: Clone Repository
```bash
git clone https://github.com/SJRVedRupesh/CodeAnalizer.git
cd CodeAnalizer
git checkout Analyzer
```

---

### Step 2: Start Backend Server
```bash
cd server
npm install
npm start
```
> Backend runs at `http://localhost:5000`

---

### Step 3: Start Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`

---

## 📡 API Endpoints Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/analyze/cpp` | Analyzes C++ code for variables, loops, STL, complexity, and generates explanations. |
| `POST` | `/api/analyze/sql` | Analyzes SQL query clauses, joins, logical execution order, and indexing advice. |
| `POST` | `/api/run/cpp` | Executes C++ code with optional stdin input. |
| `POST` | `/api/run/sql` | Runs SQL query against SQLite database and returns data rows. |
| `GET` | `/api/schemas` | Returns table schemas, column types, and sample data for schema explorer. |
| `GET` | `/api/templates` | Returns pre-built C++ and SQL code templates. |
| `POST` | `/api/history` | Saves analysis record to history. |
| `GET` | `/api/history` | Fetches recent analysis histories. |
| `GET` | `/api/health` | Health check endpoint. |

---

## 🎓 Presentation Ready Highlights

1. **Deterministic Accuracy:** Analyzes real code AST and pattern signatures, rather than returning random text.
2. **Interactive Live SQL:** Users can run queries, modify records, and observe live relational joins on SQLite tables.
3. **Beginner-Friendly:** Complex asymptotic notation ($O(N \log N)$) is explained in plain, intuitive English steps.
4. **Zero-Friction Startup:** In-memory SQLite and memory store fallbacks ensure the project runs anywhere without requiring external database server setup.

---

## 📜 License
This project is licensed under the **MIT License**.
