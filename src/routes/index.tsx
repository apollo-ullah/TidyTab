import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '../features/landing/LandingPage';
import { LoginPage } from '../features/auth/LoginPage';
import { AccountSetupPage } from '../features/auth/AccountSetupPage';
import { DashboardLayout } from '../features/dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const RequireProfileSetup = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setHasProfile(userDoc.exists());
      } catch (error) {
        console.error('Error checking user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user]);

  if (loading) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasProfile) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/setup',
    element: (
      <ProtectedRoute>
        <AccountSetupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <RequireProfileSetup>
        <DashboardLayout />
      </RequireProfileSetup>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]); 