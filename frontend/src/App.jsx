import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import OAuthSuccessPage from "./pages/OAuthSuccessPage.jsx";
import SharePage from "./pages/SharePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import DashboardHomePage from "./pages/DashboardHomePage.jsx";
import AnalyzePage from "./pages/AnalyzePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

import RepoLayout from "./layouts/RepoLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CommitsPage from "./pages/CommitsPage.jsx";
import CommitDetailPage from "./pages/CommitDetailPage.jsx";
import TimelinePage from "./pages/TimelinePage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import FilesPage from "./pages/FilesPage.jsx";
import ComparePage from "./pages/ComparePage.jsx";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/oauth-success" element={<OAuthSuccessPage />} />
      <Route path="/share/:shareId" element={<SharePage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHomePage />} />
          <Route path="/dashboard/analyze" element={<AnalyzePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/dashboard/:owner/:repo" element={<RepoLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="commits" element={<CommitsPage />} />
          <Route path="commits/:sha" element={<CommitDetailPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="compare" element={<ComparePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
