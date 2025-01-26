import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/Purple Friends Community Logo.png';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) return null;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="static" elevation={0} className="glass-card border-0 border-b border-white border-opacity-20">
      <Toolbar className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex items-center"
        >
          <Link to="/" className="text-white no-underline flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <img 
                src={logo} 
                alt="TidyTab Logo" 
                className="w-full h-full object-contain block"
              />
            </div>
            <Typography 
              variant="h5" 
              component="span"
              sx={{ 
                fontWeight: 600,
                fontSize: '1.25rem',
                color: 'white !important',
                textShadow: '0 0 20px rgba(255,255,255,0.2)',
                fontFamily: '"Bree Serif", serif',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              TidyTab
            </Typography>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <IconButton
            onClick={handleMenu}
            className="ml-2 p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
          >
            <MenuIcon className="text-white" />
          </IconButton>
        </motion.div>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            className: 'glass-card mt-2',
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <div className="px-4 py-2 border-b border-white border-opacity-20">
            <Typography variant="subtitle2" className="font-medium">
              {user.displayName}
            </Typography>
            <Typography variant="caption" className="text-white text-opacity-60">
              {user.email}
            </Typography>
          </div>
          <MenuItem
            component={Link}
            to="/dashboard"
            onClick={handleClose}
            className="hover:bg-white hover:bg-opacity-10"
          >
            My Tabs
          </MenuItem>
          <MenuItem
            onClick={handleSignOut}
            className="hover:bg-white hover:bg-opacity-10"
          >
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}; 