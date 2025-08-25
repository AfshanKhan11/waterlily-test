import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Login from "@/pages/auth/Login";
import LandingPage from "./pages/LandingPage";
import SessionDetail from "./pages/SessionDetail";
import SessionList from "./pages/SessionList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Survey from "./pages/Survey";
import SurveyComplete from "./pages/SurveyCompletion";

function App() {
  const { user, hasHydrated } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Wait for store to hydrate before rendering routes
  useEffect(() => {
    if (hasHydrated) {
      setIsCheckingAuth(false);
    }
  }, [hasHydrated]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" replace />}
        />

        {/* Default route redirects based on auth status */}
        <Route
          path="/"
          element={<Navigate to={user ? "/home" : "/login"} replace />}
        />

        {/* Protected routes - only accessible when authenticated */}
        {user ? (
          <>
            <Route path="/home" element={<LandingPage />} />
            <Route path="/sessions" element={<SessionList />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/sessions/:sessionId" element={<SessionDetail />} />
            <Route path="/survey-complete" element={<SurveyComplete />} />
          </>
        ) : (
          // Redirect all protected routes to login if not authenticated
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Fallback route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <h1>404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;