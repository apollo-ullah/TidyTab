import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../layouts/AuthLayout';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const AccountSetupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    currency: 'USD',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCurrencyChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      currency: e.target.value
    }));
  };

  const getInitials = () => {
    const first = formData.firstName.charAt(0).toUpperCase();
    const last = formData.lastName.charAt(0).toUpperCase();
    return first + last;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError('');
      setLoading(true);

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        currency: formData.currency,
        email: user.email,
        initials: getInitials(),
        createdAt: new Date().toISOString(),
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving user data:', err);
      setError('Failed to save your information. Please try again.');
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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            component="h1"
            variant="h4"
            className="gradient-text"
            sx={{ 
              mb: 2, 
              fontWeight: 700 
            }}
          >
            Complete Your Profile
          </Typography>
          <Typography
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '400px',
              mx: 'auto'
            }}
          >
            Let's get to know you better! This information will help personalize your experience.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: '2rem',
              bgcolor: 'primary.main',
              border: '4px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {formData.firstName && formData.lastName ? getInitials() : '?'}
          </Avatar>
        </Box>

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5
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
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            fullWidth
            autoFocus
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
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            fullWidth
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

          <FormControl fullWidth>
            <InputLabel 
              id="currency-label"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: 'rgba(179, 157, 219, 0.8)',
                },
              }}
            >
              Preferred Currency
            </InputLabel>
            <Select
              labelId="currency-label"
              value={formData.currency}
              onChange={handleCurrencyChange}
              label="Preferred Currency"
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(179, 157, 219, 0.6)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              {currencies.map((currency) => (
                <MenuItem 
                  key={currency.code} 
                  value={currency.code}
                  sx={{
                    '&:hover': {
                      background: 'rgba(179, 157, 219, 0.1)',
                    },
                  }}
                >
                  {currency.symbol} - {currency.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            {loading ? 'Saving...' : 'Complete Setup'}
          </Button>
        </Box>
      </motion.div>
    </AuthLayout>
  );
}; 