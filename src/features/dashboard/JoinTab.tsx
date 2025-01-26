import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { joinTab } from "../../services/tabService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import { motion } from "framer-motion";

export const JoinTab = () => {
  const [tabId, setTabId] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabId.trim() || !user) return;

    setLoading(true);
    try {
      await joinTab(tabId.trim(), user);
      toast.success("Successfully joined tab!");
      navigate(`/tabs/${tabId.trim()}`);
    } catch (error) {
      console.error("Error joining tab:", error);
      toast.error("Failed to join tab. Please check the ID and try again.");
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
              Join a Tab
            </Typography>
            
            <Typography 
              sx={{ 
                mb: 4,
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              Enter the tab ID provided by your friend to join their tab.
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
                label="Tab ID"
                value={tabId}
                onChange={(e) => setTabId(e.target.value)}
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
                {loading ? "Joining..." : "Join Tab"}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}; 
