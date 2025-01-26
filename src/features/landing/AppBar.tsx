import { useState } from "react";
import {
  AppBar as MuiAppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "FAQ", href: "#faq" },
];

export const AppBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ py: 2, position: "relative" }}>
        <IconButton
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontFamily: '"Bree Serif", serif',
            color: "white",
            textDecoration: "none",
          }}
        >
          TidyTab
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component="a"
              href={item.href}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <MuiAppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(18, 18, 18, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontFamily: '"Bree Serif", serif',
              color: "white",
              textDecoration: "none",
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              fontWeight: 600,
              textShadow: "0 0 20px rgba(255,255,255,0.2)",
            }}
          >
            TidyTab
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                component="a"
                href={item.href}
                sx={{
                  color: "white",
                  mx: 1,
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
            {user ? (
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                sx={{
                  ml: 2,
                  background: "linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)",
                  },
                }}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  ml: 2,
                  background: "linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)",
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            background: "rgba(18, 18, 18, 0.95)",
            backdropFilter: "blur(10px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        {drawer}
      </Drawer>
    </MuiAppBar>
  );
}; 
