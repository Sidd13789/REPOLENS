# RepoLens

### GitHub Repository Evolution & Analytics Platform

RepoLens is a full-stack MERN application that helps developers understand how a GitHub repository evolves over time.

Users can connect their GitHub account, analyze repositories, and explore commits, contributors, languages, activity patterns, timelines, file history, and repository evolution.

---

## 🚀 Features

* 🔐 User Authentication

  * Signup and Login
  * JWT-based authentication
  * Password hashing with bcrypt
  * Forgot and Reset Password flow

* 🐙 GitHub Integration

  * GitHub OAuth authentication
  * Connect GitHub account
  * Analyze GitHub repositories
  * Support for public and authorized private repositories

* 📊 Repository Analytics

  * Repository overview
  * Commit statistics
  * Contributor analysis
  * Programming language distribution
  * Repository activity
  * Activity heatmap
  * Timeline visualization

* 🕐 Repository Evolution

  * Explore repository history
  * Browse commits
  * View file changes
  * Track repository evolution
  * Compare repository states
  * Inspect historical snapshots

* 📁 File & Commit Exploration

  * File tree
  * Commit details
  * File history
  * Changes across commits

* 📈 Visualizations

  * Interactive charts
  * Commit activity graphs
  * Language charts
  * Contributor statistics
  * Repository timeline

* 🔗 Sharing

  * Save repository analyses
  * Share analysis pages
  * Public share links

* 📱 Responsive UI

  * GitHub-inspired interface
  * Desktop navigation
  * Mobile hamburger menu
  * Responsive dashboard

* 📚 API Documentation

  * Swagger/OpenAPI documentation
  * RESTful backend APIs

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

### APIs & Authentication

* GitHub REST API
* GitHub OAuth
* JWT Authentication

### Documentation & Testing

* Swagger / OpenAPI
* Postman
* Jest / Supertest

---

## 📂 Project Structure

```text
RepoLens/
│
├── CodeTimeMachine/
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── app.js
│   │   │
│   │   ├── tests/
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── pages/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   │
│   │   ├── public/
│   │   ├── .env.example
│   │   └── package.json
│   │
│   ├── render.yaml
│   └── README.md
```

---

## 🧩 Main Frontend Pages

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
ContributorsPage
ComparePage
FilesPage
TimelinePage

NotFoundPage
```

---

## 🗄️ Database Models

RepoLens uses MongoDB with Mongoose.

Main models include:

```text
User
Repository
Commit
Contributor
SavedAnalysis
Share
```

These models are used to manage authentication, repository information, commit data, contributors, saved analyses, and shared repository views.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sidd13789/REPOLENS.git
cd REPOLENS/CodeTimeMachine
```

---

## 🔧 Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Configure the required environment variables inside `.env`.

Example:

```env
PORT=7000

MONGO_URI=mongodb://127.0.0.1:27017/codetimemachine

JWT_SECRET=your_jwt_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:7000
```

---

## 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🐙 GitHub OAuth Setup

RepoLens supports GitHub OAuth authentication.

Create a GitHub OAuth application and configure the callback URL as:

```text
http://localhost:7000/api/auth/github/callback
```

The application requires the following GitHub OAuth scopes:

```text
read:user
user:email
repo
```

The `repo` scope is required when accessing repositories that the authenticated GitHub account is authorized to access.

Add your GitHub credentials to the backend `.env` file:

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

---

## 🔐 Authentication Flow

RepoLens uses JWT-based authentication.

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
 │   Authenticated Requests
 │
 └── GitHub OAuth
        ↓
   GitHub Authorization
        ↓
   OAuth Callback
        ↓
   User Authentication
```

---

## 🔄 Repository Analysis Flow

```text
User
  ↓
Login / GitHub OAuth
  ↓
Enter GitHub Repository
  ↓
Backend
  ↓
GitHub REST API
  ↓
Fetch Repository Data
  ↓
Store / Process Data
  ↓
Analytics APIs
  ↓
React Dashboard
  ↓
Charts + Timeline + Repository Evolution
```

---

## 📊 Repository Analytics

RepoLens provides different analytical views of a repository:

### Commits

Users can explore:

* Commit history
* Commit details
* Commit timestamps
* Commit authors
* File changes

### Contributors

Users can inspect contributor activity and contribution statistics.

### Languages

The platform displays the programming languages used by a repository.

### Activity Heatmap

Repository activity can be explored through a GitHub-style activity heatmap.

### Timeline

The timeline provides a chronological view of repository development.

---

## 🕐 Repository Evolution

One of RepoLens's main features is repository evolution analysis.

Users can:

1. Select a repository.
2. Explore its commit history.
3. Select historical points in time.
4. Inspect repository state.
5. Explore files and changes.
6. Compare different repository states.

This allows developers to understand how a codebase changed throughout its development.

---

## 🔍 Compare Repository States

The comparison feature allows users to examine differences between selected repository states.

The comparison can help identify:

* Added files
* Modified files
* Deleted files
* Changes between commits
* Repository evolution over time

---

## 📮 API Testing with Postman

Postman can be used to test the RepoLens backend REST APIs independently from the React frontend.

Typical API flow:

```text
Signup
  ↓
Login
  ↓
Receive JWT
  ↓
Send JWT in Authorization Header
  ↓
Call Protected APIs
```

Example authorization header:

```text
Authorization: Bearer <JWT_TOKEN>
```

Postman is useful for testing:

* Authentication APIs
* Repository analysis APIs
* Commit APIs
* Contributor APIs
* Timeline APIs
* Analytics APIs
* Share APIs
* Health APIs

---

## 📚 API Documentation

Swagger/OpenAPI documentation is available through the backend API documentation route.

After starting the backend, open the configured Swagger documentation endpoint in your browser.

The Swagger interface provides information about available API endpoints, request parameters, authentication, and responses.

---

## 🔑 Environment Variables

### Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
FRONTEND_URL=
```

### Frontend

Configure the frontend environment variables according to the `.env.example` file included in the project.

> Never commit `.env` files or API secrets to GitHub.

---

## 🧪 Testing

Backend tests are located inside:

```text
backend/tests/
```

Run the configured test command:

```bash
npm test
```

---

## 🐳 Docker

The backend includes a Dockerfile for containerized deployment.

Build the backend image:

```bash
docker build -t repolens-backend ./backend
```

Run the container:

```bash
docker run -p 7000:7000 repolens-backend
```

---

## ☁️ Deployment

The project contains deployment configuration through:

```text
render.yaml
```

For production deployment, configure:

* MongoDB connection
* JWT secret
* GitHub OAuth credentials
* Frontend URL
* Backend URL
* Environment variables

GitHub OAuth callback URLs must also be updated to the production backend URL.

---

## ⚠️ Limitations

* GitHub API rate limits apply.
* Repository analysis depends on GitHub API availability.
* Private repository access requires appropriate GitHub authorization.
* Large repositories may require additional API requests and processing time.
* OAuth configuration is required for GitHub account integration.

---

## 🔒 Security

The application follows several security practices:

* Passwords are hashed using bcrypt.
* JWT is used for authenticated API requests.
* Sensitive environment variables are stored outside source code.
* `.env` files should not be committed.
* GitHub OAuth credentials should remain private.
* Protected API routes require authentication.

---

## 🎯 Use Cases

RepoLens can be useful for:

* Developers learning from open-source projects
* Understanding the history of a codebase
* Analyzing team contribution patterns
* Exploring repository activity
* Studying how projects evolve
* Reviewing historical code changes
* Understanding development timelines

---

## 🚀 Future Improvements

Possible future improvements include:

* Advanced code-change visualization
* More detailed contributor analytics
* AI-powered repository insights
* Improved commit comparison
* Advanced repository search
* More GitHub activity metrics
* Performance optimizations for large repositories
* Additional repository providers

---

## 👨‍💻 Author

**Siddhartha Dwivedi**

B.Tech Computer Science & Engineering
Specialization: Artificial Intelligence & Machine Learning

GitHub: **Sidd13789**

---

## ⭐ Support

If you find RepoLens useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is intended for educational and portfolio purposes.
