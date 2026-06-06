import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell.jsx";
import { PageTransition } from "./components/PageTransition.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ResultsPage } from "./pages/ResultsPage.jsx";
import { TestTakingPage } from "./pages/TestTakingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { Preloader } from "./components/Preloader.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { TeacherDashboard } from "./pages/TeacherDashboard.jsx";
import { LeaderboardPage } from "./pages/LeaderboardPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { MyExamsPage } from "./pages/MyExamsPage.jsx";
import { ExamCreator } from "./pages/ExamCreator.jsx";
import { AllStudentsPage } from "./pages/PlaceholderPages.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { useAuthStore } from "./state/authStore";

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <>
      <Preloader />
      <AppShell>
        <PageTransition>
          <Routes>
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/create-exam" element={<ProtectedRoute role={["admin", "teacher"]}><ExamCreator /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute adminOnly><AllStudentsPage /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><MyExamsPage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/exam/:examId" element={<ProtectedRoute><TestTakingPage /></ProtectedRoute>} />
            <Route path="/results/:attemptId" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />

            {/* Public-only routes (redirect to home if already logged in) */}
            <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : "/"} replace /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
            <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />} />
            <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ResetPasswordPage />} />

            {/* Public routes (accessible logged in or not) */}
            <Route path="/contact" element={<ContactPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </AppShell>
    </>
  );
}
