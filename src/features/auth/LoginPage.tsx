import { useState } from 'react';
import { Box, Typography, TextField, Button, Link as MuiLink, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../layouts/AuthLayout';
import GoogleIcon from '@mui/icons-material/Google';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signInWithGoogle, checkProfileSetup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);
      const hasProfile = await checkProfileSetup(result.user.uid);
      navigate(hasProfile ? '/dashboard' : '/setup');
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await signInWithGoogle();
      if (result) {
        const hasProfile = await checkProfileSetup(result.user.uid);
        if (hasProfile) {
          toast.success('Successfully signed in!');
          navigate('/dashboard');
        } else {
          toast.success('Welcome! Let\'s set up your profile.');
          navigate('/setup');
        }
      }
    } catch (err) {
      console.error('Error signing in with Google:', err);
      toast.error('Failed to sign in with Google');
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

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={loading}
          sx={{
            mb: 3,
            py: 1.5,
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              background: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          Continue with Google
        </Button>

        <Box sx={{ position: 'relative', my: 3 }}>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Typography
            variant="body2"
            component="span"
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              px: 2,
              color: 'white',
              fontWeight: 600,
              background: 'transparent'
            }}
          >
            or
          </Typography>
        </Box>
        
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
            sx={{ 
              py: 1.5,
              background: 'linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)',
              }
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
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
                  color: 'rgba(179, 157, 219, 1)',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
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