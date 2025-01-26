import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getTab, subscribeToTab, createExpenseFromOCR, addManualExpense } from '../../services/tabService';
import { Tab } from '../../types/tab';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Fab
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { format } from 'date-fns';
import { OCRUploader } from './OCRUploader';
import { OCRResult } from '../../services/ocrService';
import { toast } from 'react-hot-toast';
import { AddExpenseDialog } from './AddExpenseDialog';

export const TabView = () => {
  const { tabId } = useParams();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab | null>(null);
  const [loading, setLoading] = useState(true);
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  const [scanningReceipt, setScanningReceipt] = useState(false);
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);

  useEffect(() => {
    const loadTab = async () => {
      if (!tabId || !user) return;
      try {
        const tabData = await getTab(tabId);
        setTab(tabData);
      } catch (error) {
        console.error('Error loading tab:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTab();

    // Subscribe to real-time updates
    if (tabId && user) {
      const unsubscribe = subscribeToTab(
        tabId,
        (updatedTab) => setTab(updatedTab),
        (error) => console.error('Error in tab subscription:', error)
      );

      return () => unsubscribe();
    }
  }, [tabId, user]);

  const handleScanClick = () => {
    if (!user || !tabId) {
      toast.error('Please log in to scan receipts');
      return;
    }
    setOcrDialogOpen(true);
  };

  const handleAddExpenseClick = () => {
    console.log('Opening add expense dialog');
    setAddExpenseDialogOpen(true);
  };

  const handleScanComplete = async (result: OCRResult) => {
    if (!tabId || !user) {
      toast.error('Please log in to add expenses');
      return;
    }
    
    try {
      setScanningReceipt(true);
      console.log('Processing OCR result:', result);
      
      await createExpenseFromOCR(tabId, user, result);
      toast.success('Receipt scanned successfully!');
      setOcrDialogOpen(false);
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to add expense. Please try again.');
    } finally {
      setScanningReceipt(false);
    }
  };

  const handleAddExpenseSubmit = async (expenseData: {
    description: string;
    amount: number;
  }) => {
    if (!user || !tabId) return;

    setAddingExpense(true);
    try {
      await addManualExpense(tabId, user, {
        description: expenseData.description,
        amount: expenseData.amount,
        items: [],
        paidBy: user.uid,
        createdBy: user.uid
      });
      toast.success('Expense added successfully!');
      setAddExpenseDialogOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
    } finally {
      setAddingExpense(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          pt: '64px',
        }}
      >
        <motion.div
          key="loading-spinner-container"
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
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
        </motion.div>
      </Box>
    );
  }

  if (!tab) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Tab not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0A0A0A', pt: '84px', pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <motion.div
              key={`header-section-${tab.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper className="glass-card" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {tab.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      {tab.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Created on {format(tab.createdAt, 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      ${tab.totalAmount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Total Amount
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Members Section */}
          <Grid item xs={12} md={4}>
            <motion.div
              key={`members-section-${tab.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper className="glass-card" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Members</Typography>
                <List>
                  {Object.entries(tab.memberDetails).map(([uid, member], index) => (
                    <motion.div
                      key={`member-${tab.id}-${uid}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Box>
                        {index > 0 && <Divider sx={{ my: 1 }} />}
                        <ListItem sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar src={member.photoURL || undefined}>
                              {member.displayName?.charAt(0) || member.email?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={member.displayName || member.email}
                            secondary={
                              <Typography variant="body2" sx={{ color: member.balance >= 0 ? 'success.main' : 'error.main' }}>
                                ${member.balance.toFixed(2)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </Box>
                    </motion.div>
                  ))}
                </List>
              </Paper>
            </motion.div>
          </Grid>

          {/* Expenses Section */}
          <Grid item xs={12} md={8}>
            <motion.div
              key={`expenses-section-${tab.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper className="glass-card" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Expenses</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => setAddExpenseDialogOpen(true)}
                      startIcon={<AddIcon />}
                      disabled={addingExpense || scanningReceipt}
                      sx={{
                        background: 'linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)',
                        }
                      }}
                    >
                      Add Expense
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleScanClick}
                      startIcon={<CameraAltIcon />}
                      disabled={scanningReceipt || addingExpense}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      Scan Receipt
                    </Button>
                  </Box>
                </Box>

                {tab.expenses.length === 0 ? (
                  <motion.div
                    key={`no-expenses-${tab.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 8,
                        textAlign: 'center'
                      }}
                    >
                      <ReceiptLongIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}>
                        No expenses yet
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<CameraAltIcon />}
                        onClick={handleScanClick}
                        sx={{
                          background: 'linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)',
                          }
                        }}
                      >
                        Scan a Receipt
                      </Button>
                    </Box>
                  </motion.div>
                ) : (
                  <List>
                    {tab.expenses.map((expense, index) => (
                      <motion.div
                        key={`expense-${tab.id}-${expense.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box>
                          {index > 0 && <Divider sx={{ my: 1 }} />}
                          <ListItem sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                ${expense.amount.toFixed(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={expense.description}
                              secondary={
                                <Box>
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Paid by {tab.memberDetails[expense.paidBy]?.displayName || 'Unknown'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'primary.main' }}>
                                    ${expense.amount.toFixed(2)}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </Box>
                      </motion.div>
                    ))}
                  </List>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button for quick expense addition */}
      <Fab
        color="primary"
        onClick={handleScanClick}
        disabled={scanningReceipt || addingExpense}
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
        <CameraAltIcon />
      </Fab>

      {/* OCR Dialog */}
      <OCRUploader
        open={ocrDialogOpen}
        onClose={() => setOcrDialogOpen(false)}
        onScanComplete={handleScanComplete}
        loading={scanningReceipt}
      />

      <AddExpenseDialog
        open={addExpenseDialogOpen}
        onClose={() => setAddExpenseDialogOpen(false)}
        onSubmit={handleAddExpenseSubmit}
        loading={addingExpense}
      />
    </Box>
  );
}; 
