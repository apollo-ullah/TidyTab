import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createTab } from '../../services/tabService';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  ButtonGroup,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TabCategory } from '../../types/tab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

export const CreateTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TabCategory>('restaurant');
  const [date, setDate] = useState<Date>(new Date());
  const [createdTab, setCreatedTab] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const tabId = await createTab({ name, description, category, date }, user);
      setCreatedTab({ id: tabId, name });
      toast.success('Tab created successfully!');
      navigate(`/tabs/${tabId}`);
    } catch (error) {
      console.error('Error creating tab:', error);
      toast.error('Failed to create tab');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyId = () => {
    if (createdTab) {
      navigator.clipboard.writeText(createdTab.id);
      toast.success('Tab ID copied to clipboard!');
    }
  };

  const handleGoToTab = () => {
    if (createdTab) {
      navigate(`/tabs/${createdTab.id}`);
    }
  };

  if (createdTab) {
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
                Tab Created!
              </Typography>
              
              <Typography 
                sx={{ 
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                Share this QR code or Tab ID with others:
              </Typography>

              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3
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
              value={createdTab.id}
              size={200}
              level="H"
              includeMargin
                    style={{ background: 'white', padding: 8, borderRadius: 8 }}
                  />
                </Box>

                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 1
                    }}
                  >
                    Tab ID:
                  </Typography>
                  <ButtonGroup 
                    variant="outlined" 
                    sx={{ 
                      width: '100%',
                      '& .MuiButtonGroup-grouped': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    <Button
                      sx={{
                        flex: 1,
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        py: 1.5
                      }}
                      disabled
                    >
                      {createdTab.id}
                    </Button>
                    <Button
                      onClick={handleCopyId}
                      sx={{
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      <ContentCopyIcon />
                    </Button>
                  </ButtonGroup>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleGoToTab}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    px: 4,
                    background: 'linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)',
                    }
                  }}
                >
                  Go to Tab
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
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
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              Create a New Tab
            </Typography>
            
            <Typography 
              sx={{ 
                mb: 4,
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              Create a new tab to start tracking shared expenses with friends.
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
                label="Tab Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                variant="outlined"
                disabled={isLoading}
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

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newDate) => setDate(newDate || new Date())}
                  disabled={isLoading}
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
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </LocalizationProvider>

              <FormControl>
                <FormLabel 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: 'rgba(255, 255, 255, 0.8)'
                    }
                  }}
                >
                  Category
                </FormLabel>
                <RadioGroup
                  row
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TabCategory)}
                  sx={{
                    gap: 2,
                    '& .MuiRadio-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-checked': {
                        color: '#B39DDB'
                      }
                    },
                    '& .MuiFormControlLabel-label': {
                      color: 'white'
                    }
                  }}
                >
                  <FormControlLabel 
                    value="restaurant" 
                    control={<Radio />} 
                    label="Restaurant" 
                  />
                  <FormControlLabel 
                    value="activities" 
                    control={<Radio />} 
                    label="Activities" 
                  />
                  <FormControlLabel 
                    value="other" 
                    control={<Radio />} 
                    label="Other" 
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                label="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                disabled={isLoading}
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
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)',
                  }
                }}
              >
                {isLoading ? "Creating..." : "Create Tab"}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}; 