import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Box } from '@mui/material';

export const Hero = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 12, md: 16 },
        pb: { xs: 8, md: 12 },
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Typography
                component="h1"
                variant="h1"
                className="hero-gradient-text"
                sx={{
                  fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 2,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Split Bills,<br />Not Friendships
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 300,
                  mb: 4,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                Simplify Group Payments. Keep Tabs. Stay Tidy.
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  '& a': {
                    transition: 'all 0.3s ease-in-out',
                    transform: 'translateY(0)',
                    '&:hover': {
                      transform: 'translateY(-3px)'
                    }
                  }
                }}
              >
                <Link to="/login" className="primary-button">
                  Get Started Free
                </Link>
                <motion.a 
                  href="#features" 
                  className="glass-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.a>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* Add your actual hero image or illustration here */}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}; 