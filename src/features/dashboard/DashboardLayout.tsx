import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Grid,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export const DashboardLayout = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleSettings = () => {
    handleCloseMenu();
    navigate('/settings/profile');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      {/* Compact Header */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          height: '64px'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: '64px' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/dashboard"
              sx={{
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              TidyTab
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <IconButton
              onClick={handleOpenMenu}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              PaperProps={{
                sx: {
                  background: 'rgba(18, 18, 18, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  minWidth: '200px',
                  mt: 1
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {user?.displayName || user?.email}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user?.email}
                </Typography>
              </Box>
              
              <MenuItem
                onClick={handleSettings}
                sx={{
                  color: 'white',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <SettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                Settings
              </MenuItem>

              <MenuItem
                onClick={handleSignOut}
                sx={{
                  color: 'white',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '84px',
          px: 3,
          pb: 3,
          width: '100%',
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Welcome Section */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      mb: 1
                    }}
                  >
                    Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    Manage your tabs and track shared expenses with friends.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Box 
                  className="glass-card"
                  sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                  <Button
                    component={Link}
                    to="/tabs/new"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ 
                      py: 1.5,
                      background: 'linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)',
                      }
                    }}
                  >
                    Create New Tab
                  </Button>
                  <Button
                    component={Link}
                    to="/tabs/join"
                    variant="outlined"
                    sx={{ 
                      py: 1.5,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    Join Existing Tab
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box 
                  className="glass-card"
                  sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      minHeight: 150,
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <Typography>No recent activity</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Your Tabs */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Box 
                  className="glass-card"
                  sx={{ 
                    p: 3,
                    minHeight: 200
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>Your Tabs</Typography>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      minHeight: 150,
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <Typography>No tabs created yet</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          component={Link}
          to="/tabs/new"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)',
            }
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}; 
