import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTab, subscribeToTab } from "../../services/tabService";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";
import { Tab } from "../../types/tab";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";

export const TabView = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the current URL for sharing
  const shareUrl = `${window.location.origin}/join/${tabId}`;

  useEffect(() => {
    if (!tabId) return;

    const loadTab = async () => {
      try {
        const tabData = await getTab(tabId);
        setTab(tabData);
      } catch (error) {
        console.error('Error loading tab:', error);
        toast.error('Failed to load tab');
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to real-time updates
    const unsubscribe = subscribeToTab(
      tabId,
      (updatedTab) => setTab(updatedTab),
      (error) => {
        console.error('Error subscribing to tab:', error);
        toast.error('Failed to get real-time updates');
      }
    );

    loadTab();
    return () => unsubscribe();
  }, [tabId]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 64px)',
          pt: '64px'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            className="loading-spinner"
            sx={{ 
              width: 40,
              height: 40,
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTop: '3px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          />
        </motion.div>
      </Box>
    );
  }

  if (!tab) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 64px)',
          pt: '64px'
        }}
      >
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Tab not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        pt: '84px',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              {tab.name}
            </Typography>
            
            {tab.description && (
              <Typography 
                sx={{ 
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                {tab.description}
              </Typography>
            )}

            {/* Share Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Share Tab</Typography>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}
              >
                <Box 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    p: 3,
                    borderRadius: 2,
                    textAlign: 'center'
                  }}
                >
                  <QRCodeSVG
                    value={shareUrl}
                    size={160}
                    level="H"
                    includeMargin
                    style={{ background: 'white', padding: 8, borderRadius: 8 }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      mt: 1,
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    Scan to join
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    Or share this link:
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        p: 2,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {shareUrl}
                    </Box>
                    <Box
                      component="button"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        toast.success('Link copied to clipboard!');
                      }}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        borderRadius: 1,
                        px: 2,
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      Copy
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}; 
