import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CreateTab } from './components/CreateTab';
import { JoinTab } from './components/JoinTab';
import { TabView } from './components/TabView';
import { Header } from './components/Header';
import { theme } from './theme';

// Component to handle joining via QR code
const JoinRedirect = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    // Store the tab ID in session storage to redirect after login
    if (tabId) {
      sessionStorage.setItem('pendingJoinTabId', tabId);
    }
    return <Navigate to="/login" />;
  }

  // Redirect to the tab view - the join logic will happen there
  return <Navigate to={`/tabs/${tabId}`} />;
};

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Check if there's a pending tab to join
      const pendingTabId = sessionStorage.getItem('pendingJoinTabId');
      if (pendingTabId) {
        sessionStorage.removeItem('pendingJoinTabId');
        navigate(`/tabs/${pendingTabId}`);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 glass-card p-8">
        <div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-4xl font-extrabold gradient-text"
          >
            Welcome to TidyTab
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-center text-lg text-white text-opacity-80"
          >
            Split expenses with friends, hassle-free
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleSignIn}
          className="glass-button w-full"
        >
          Sign in with Google
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-300 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CreateTab />
        <JoinTab />
      </div>
    </motion.div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Header />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
              }}
            />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/join/:tabId" element={<JoinRedirect />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tabs/:tabId"
                  element={
                    <ProtectedRoute>
                      <TabView />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
