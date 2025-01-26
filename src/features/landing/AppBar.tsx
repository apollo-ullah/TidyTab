import { useState } from "react";
import { Link } from "react-router-dom";
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
  Typography,
  Container,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/Purple Friends Community Logo.png";

const navItems = [
  { name: "Features", href: "#features" },
  { name: "Login", href: "/login" },
];

export const AppBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ my: 2 }}>
        <Link to="/">
          <img src={logo} alt="TidyTab" className="h-8" />
        </Link>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.href}
              sx={{
                textAlign: "center",
                color: "white",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <MuiAppBar
        component="nav"
        sx={{
          background: "transparent",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Link
              to="/"
              className="flex items-center gap-3"
              style={{ textDecoration: "none" }}
            >
              <img src={logo} alt="TidyTab" className="h-8" />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", sm: "block" },
                  color: "white",
                  fontWeight: 700,
                }}
              >
                TidyTab
              </Typography>
            </Link>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) =>
                item.name === "Login" && user ? null : (
                  <Button
                    key={item.name}
                    component={Link}
                    to={item.href}
                    sx={{
                      color: "white",
                      ml: 2,
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                )
              )}
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              background: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(10px)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}; 
