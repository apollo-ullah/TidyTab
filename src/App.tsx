import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { AccountSetupPage } from './features/auth/AccountSetupPage';
import { DashboardLayout } from './features/dashboard/DashboardLayout';
import { CreateTab } from './features/dashboard/CreateTab';
import { JoinTab } from './features/dashboard/JoinTab';
import { TabView } from './features/dashboard/TabView';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected routes */}
        <Route path="/setup" element={
          <ProtectedRoute>
            <AccountSetupPage />
          </ProtectedRoute>
        } />
        
        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        <Route path="/tabs/new" element={
          <ProtectedRoute>
            <CreateTab />
          </ProtectedRoute>
        } />
        <Route path="/tabs/join" element={
          <ProtectedRoute>
            <JoinTab />
          </ProtectedRoute>
        } />
        <Route path="/tabs/:tabId" element={
          <ProtectedRoute>
            <TabView />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
