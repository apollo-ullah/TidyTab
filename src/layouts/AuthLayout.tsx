import { Box, Container } from '@mui/material';
import { StarryBackground } from '../components/StarryBackground';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box className="min-h-screen relative">
      <StarryBackground />
      <Container 
        maxWidth="sm" 
        sx={{ 
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 }
        }}
      >
        <Box
          className="glass-card"
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}; 