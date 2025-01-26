import { useState } from 'react';
import { Box, Typography, TextField, Button, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../layouts/AuthLayout';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const userCredential = await login(email, password);
      if (userCredential.user) {
        // Check if user has completed profile setup
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (!userDoc.exists()) {
          navigate('/setup');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          component="h1"
          variant="h4"
          className="gradient-text"
          sx={{ 
            mb: 3, 
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          Welcome Back
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2 
          }}
        >
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2,
                textAlign: 'center',
                fontSize: '0.9rem'
              }}
            >
              {error}
            </Typography>
          )}
          
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(179, 157, 219, 0.6)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(179, 157, 219, 0.6)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="primary-button"
            sx={{ 
              mt: 2,
              py: 1.5
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '& a': {
                  color: 'rgba(179, 157, 219, 1)',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
              }}
            >
              Don't have an account?{' '}
              <MuiLink component={Link} to="/signup">
                Sign up
              </MuiLink>
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1,
                '& a': {
                  color: 'rgba(179, 157, 219, 0.8)',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'rgba(179, 157, 219, 1)',
                  },
                },
              }}
            >
              <MuiLink component={Link} to="/forgot-password">
                Forgot Password?
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </AuthLayout>
  );
}; 