import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
  ListItemIcon,
  Button,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../../contexts/AuthContext';

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
              }}
            >
              TidyTab
            </Typography>

            <Box sx={{ flexGrow: 0 }}>
              <Button
                onClick={handleOpenMenu}
                sx={{
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  color: 'white',
                  textTransform: 'none',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
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
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    {user?.email?.split('@')[0]}
                  </Typography>
                </Box>
                <KeyboardArrowDownIcon 
                  sx={{ 
                    fontSize: 20,
                    opacity: 0.7,
                    ml: { xs: 0, sm: 1 }
                  }} 
                />
              </Button>
              <Menu
                sx={{ mt: '10px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                  className: 'glass-card',
                  elevation: 0,
                  sx: {
                    background: 'rgba(18, 18, 18, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'visible',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Signed in as
                  </Typography>
                  <Typography sx={{ fontSize: '0.95rem', color: 'white', fontWeight: 500 }}>
                    {user?.email}
                  </Typography>
                </Box>
                <MenuItem 
                  sx={{ 
                    color: 'white',
                    minWidth: 200,
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem 
                  onClick={handleSignOut}
                  sx={{ 
                    color: 'white',
                    minWidth: 200,
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </Typography>
          
          {/* Add your dashboard content here */}
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Tabs
            </Typography>
            <Typography color="text.secondary">
              No tabs created yet. Create a new tab to get started!
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}; 
