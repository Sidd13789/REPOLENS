# RepoLens

### GitHub Repository Evolution & Analytics Platform

RepoLens is a full-stack MERN application that helps developers analyze and understand the evolution of GitHub repositories over time.

It allows users to authenticate, connect their GitHub account, analyze repositories, and explore commits, contributors, languages, activity, timelines, files, and repository changes.

---

## 🚀 Features

### 🔐 Authentication

* User Signup
* User Login
* JWT-based authentication
* Password hashing using bcrypt
* Forgot Password
* Reset Password
* Protected routes

### 🐙 GitHub Integration

* GitHub OAuth authentication
* Connect GitHub account
* Analyze GitHub repositories
* Access authorized private repositories
* Fetch repository data using GitHub REST API

### 📊 Repository Analytics

* Repository information
* Commit statistics
* Contributor analysis
* Programming language distribution
* Repository activity
* Activity heatmap
* Timeline visualization

### 🕐 Repository Evolution

* Explore repository history
* Browse commits
* View commit details
* Track repository changes over time
* Explore historical repository states
* Compare repository states

### 📁 File Exploration

* Repository file tree
* File history
* File changes
* Commit-based file exploration

### 📈 Data Visualization

Interactive visualizations using Recharts for:

* Commit activity
* Languages
* Contributors
* Repository timeline
* Analytics
* Activity patterns

### 🔗 Sharing

* Save repository analyses
* Create shareable analysis pages
* View shared repository analysis

### 📱 Responsive Interface

* GitHub-inspired UI
* Responsive dashboard
* Desktop navigation
* Mobile hamburger menu
* Dark mode support

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Recharts
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### APIs & Integration

* GitHub REST API
* GitHub OAuth
* REST APIs

### API Testing & Documentation

* Postman
* Swagger / OpenAPI

---

## 📂 Project Structure

```text
RepoLens/
│
└── CodeTimeMachine/
    │
    ├── backend/
    │   ├── src/
    │   │   ├── config/
    │   │   ├── controllers/
    │   │   ├── middleware/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── services/
    │   │   └── app.js
    │   │
    │   ├── tests/
    │   ├── Dockerfile
    │   └── package.json
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── context/
    │   │   ├── pages/
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   │
    │   ├── public/
    │   └── package.json
    │
    ├── .gitignore
    └── README.md
```

---

## 📄 Frontend Pages

The frontend contains pages for authentication, repository analysis, analytics, profile management, and repository exploration.

```text
LandingPage
LoginPage
SignupPage
ForgotPasswordPage
ResetPasswordPage
OAuthSuccessPage

DashboardHomePage
DashboardPage
AnalyzePage
ProfilePage
SettingsPage
SharePage

AnalyticsPage
CommitsPage
CommitDetailPage
ComparePage
FilesPage
TimelinePage

NotFoundPage
```

---

## 🧩 Backend Architecture

The backend follows a modular Express.js structure.

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
MongoDB / GitHub API
```

### Main Backend Components

```text
Controllers
├── Authentication
├── Repository
├── Share
└── Health

Models
├── User
├── Repository
├── Commit
├── Contributor
├── SavedAnalysis
└── Share

Services
└── GitHub API Service
```

---

## 🗄️ Database

RepoLens uses **MongoDB** with **Mongoose**.

Main collections/models include:

```text
User
Repository
Commit
Contributor
SavedAnalysis
Share
```

MongoDB stores application and repository-related information required by the platform.

---

## ⚙️ Installation

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/Sidd13789/REPOLENS.git
```

Then move into the project:

```bash
cd REPOLENS/CodeTimeMachine
```

---

## 2. Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file manually inside the `backend` folder.

Example configuration:

```env
PORT=7000

MONGO_URI=mongodb://127.0.0.1:27017/codetimemachine

JWT_SECRET=your_jwt_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

FRONTEND_URL=http://localhost:5173
```

> Do not upload your `.env` file to GitHub.

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:7000
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🐙 GitHub OAuth Configuration

RepoLens uses GitHub OAuth for GitHub account integration.

Create a GitHub OAuth application and configure the callback URL:

```text
http://localhost:7000/api/auth/github/callback
```

Required OAuth scopes:

```text
read:user
user:email
repo
```

Add the GitHub OAuth credentials to the backend `.env` file:

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

---

## 🔐 Authentication Flow

```text
User
 │
 ├── Signup
 │      ↓
 │   Password Hashing
 │      ↓
 │   MongoDB
 │
 ├── Login
 │      ↓
 │   JWT Token
 │      ↓
 │   Protected APIs
 │
 └── GitHub OAuth
        ↓
   GitHub Authorization
        ↓
   OAuth Callback
        ↓
   Authenticated User
```

---

## 🔄 Repository Analysis Flow

```text
User
  ↓
Login / GitHub OAuth
  ↓
Select Repository
  ↓
Backend
  ↓
GitHub REST API
  ↓
Repository Data
  ↓
Backend Processing
  ↓
Analytics APIs
  ↓
React Dashboard
  ↓
Charts + Timeline + Repository Evolution
```

---

## 📊 Analytics

RepoLens provides multiple ways to understand a repository.

### Commit Analysis

Users can explore:

* Commit history
* Commit authors
* Commit timestamps
* Commit details
* Changed files

### Contributor Analysis

The contributor section provides information about repository contributors and their activity.

### Language Analysis

The language section displays the programming languages used in the repository.

### Activity Heatmap

The activity heatmap provides a visual representation of repository activity.

### Timeline

The timeline displays repository development activity chronologically.

---

## 🕐 Repository Evolution

The repository evolution feature helps users understand how a codebase changes over time.

Users can:

1. Select a repository.
2. Explore its commit history.
3. Select a point in the repository's history.
4. Explore files at that point.
5. Inspect changes.
6. Compare repository states.

This provides a historical view of the development of a repository.

---

## 🔍 Repository Comparison

RepoLens allows users to compare repository states and inspect changes between them.

The comparison can include:

* Added files
* Modified files
* Deleted files
* Changes between commits
* Differences between repository states

---

## 📮 Postman API Testing

Postman can be used to test the backend APIs independently from the React frontend.

Typical authentication flow:

```text
Signup
   ↓
Login
   ↓
JWT Token
   ↓
Authorization Header
   ↓
Protected API
```

For protected APIs, send the JWT token using:

```text
Authorization: Bearer <JWT_TOKEN>
```

Postman can be used to test APIs related to:

* Authentication
* Repository analysis
* Commits
* Contributors
* Languages
* Timeline
* Analytics
* Repository evolution
* Sharing
* Health checks

---

## 📚 Swagger API Documentation

RepoLens includes Swagger/OpenAPI documentation for the backend APIs.

After starting the backend, open the Swagger documentation endpoint configured in the backend.

Swagger provides information about:

* Available API endpoints
* HTTP methods
* Request parameters
* Request bodies
* Authentication
* API responses

---

## 🔑 Environment Variables

The backend requires environment variables for local development.

```env
PORT=
MONGO_URI=
JWT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
FRONTEND_URL=
```

> Environment variables containing secrets should never be committed to GitHub.

---

## 🧪 Testing

Backend tests are available inside:

```text
backend/tests/
```

Run tests using:

```bash
npm test
```

---

## ⚠️ Limitations

* GitHub API rate limits apply.
* Repository analysis depends on GitHub API availability.
* Private repository access requires appropriate GitHub permissions.
* Large repositories may require more API requests.
* GitHub OAuth credentials are required for GitHub account integration.

---

## 🎯 Use Cases

RepoLens can be used for:

* Understanding open-source projects
* Studying repository history
* Exploring how codebases evolve
* Analyzing contributor activity
* Understanding development timelines
* Exploring commit history
* Reviewing file changes
* Comparing repository states

---

## 🚀 Future Improvements

* AI-powered repository insights
* Advanced code-change visualization
* More detailed contributor analytics
* Improved commit comparison
* Advanced repository search
* Additional repository metrics
* Performance improvements for large repositories
* Support for additional code-hosting platforms

---

## 👨‍💻 Author

### Siddhartha Dwivedi

B.Tech Computer Science & Engineering
Specialization: Artificial Intelligence & Machine Learning
Kanpur Institute of Technology

GitHub: **Sidd13789**

---

## ⭐ Support

If you find RepoLens useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is created for educational and portfolio purposes.
