import { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, checkDatabaseConnection } from '../../config/firebase';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Maximum number of retries for database operations
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);

  const retryOperation = async (operation: () => Promise<any>) => {
    let lastError;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        return await operation();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        lastError = error;
        if (i < MAX_RETRIES - 1) {
          await wait(RETRY_DELAY * Math.pow(2, i)); // Exponential backoff
        }
      }
    }
    throw lastError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Check database connection first
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to the database. Please check your internet connection.');
      }

      // Update Firebase Auth profile with retry
      await retryOperation(async () => {
        await updateProfile(user, { displayName });
      });

      // Update or create Firestore user document with retry
      const userRef = doc(db, 'users', user.uid);
      await retryOperation(async () => {
        try {
          await updateDoc(userRef, {
            displayName,
            updatedAt: new Date().toISOString()
          });
        } catch (error: any) {
          // If document doesn't exist, create it
          if (error?.code === 'not-found') {
            await setDoc(userRef, {
              displayName,
              email: user.email,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          } else {
            throw error;
          }
        }
      });

      toast.success('Profile updated successfully!');
      // Navigate back to dashboard after successful update
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to update profile. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        pt: '84px',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              Profile Settings
            </Typography>
            
            <Typography 
              sx={{ 
                mb: 4,
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              Update your profile information
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
              <TextField
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                fullWidth
                variant="outlined"
                disabled={loading}
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
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}; 