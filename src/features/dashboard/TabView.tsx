import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTab, subscribeToTab, addManualExpense } from "../../services/tabService";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";
import { Tab, TabMember, Expense, Balance, ExpenseItem } from "../../types/tab";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AddExpenseDialog } from './AddExpenseDialog';

export const TabView = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab | null>(null);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  const [manualExpenseDialogOpen, setManualExpenseDialogOpen] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);

  // Get the current URL for sharing
  const shareUrl = `${window.location.origin}/join/${tabId}`;

  useEffect(() => {
    if (!tabId || !user) return;

    const loadTab = async () => {
      try {
        const tabData = await getTab(tabId);
        if (tabData) {
        setTab(tabData);
          calculateBalances(tabData);
        }
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
      (updatedTab) => {
        setTab(updatedTab);
        calculateBalances(updatedTab);
      },
      (error) => {
        console.error('Error in tab subscription:', error);
        toast.error('Failed to get real-time updates');
      }
    );

    loadTab();
    return () => unsubscribe();
  }, [tabId, user]);

  const calculateBalances = (currentTab: Tab) => {
    if (!currentTab?.memberDetails) return;

    // Initialize balances for each member
    const newBalances: Balance[] = Object.values(currentTab.memberDetails).map(member => ({
      userId: member.uid,
      amount: 0,
      owes: {},
      owed: {}
    }));

    // Calculate expenses if they exist
    if (currentTab.expenses?.length > 0) {
      currentTab.expenses.forEach(expense => {
        const payer = newBalances.find(b => b.userId === expense.paidBy);
        if (!payer) return;

        expense.items?.forEach(item => {
          if (!item.assignedTo?.length) return;

          const perPersonAmount = item.totalPrice / item.assignedTo.length;

          item.assignedTo.forEach(userId => {
            if (userId !== expense.paidBy) {
              // Update how much each person owes the payer
              payer.owed[userId] = (payer.owed[userId] || 0) + perPersonAmount;
              const debtor = newBalances.find(b => b.userId === userId);
              if (debtor) {
                debtor.owes[expense.paidBy] = (debtor.owes[expense.paidBy] || 0) + perPersonAmount;
                debtor.amount -= perPersonAmount;
              }
            }
          });

          payer.amount += item.totalPrice;
        });
      });
    }

    setBalances(newBalances);
  };

  const handleTabClick = (tab: Tab) => {
    navigate(`/tabs/${tab.id}`);
  };

  const handleAddExpense = async (expenseData: { description: string; amount: number }) => {
    if (!user || !tabId || !tab) return;
    
    try {
      setAddingExpense(true);
      const expenseItem: ExpenseItem = {
        name: expenseData.description,
        quantity: 1,
        unitPrice: expenseData.amount,
        totalPrice: expenseData.amount,
        assignedTo: Object.keys(tab.memberDetails)
      };
      
      await addManualExpense(tabId, user, {
        description: expenseData.description,
        amount: expenseData.amount,
        items: [expenseItem],
        paidBy: user.uid,
        createdBy: user.uid
      });
      
      toast.success('Expense added successfully');
      setManualExpenseDialogOpen(false);
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
          pt: '64px'
        }}
      >
        <motion.div
          key="loading-spinner"
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
    <Box sx={{ pt: '84px', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Header Section with Back Button */}
          <Grid item xs={12}>
            <motion.div
              key={`header-${tab?.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconButton
                    onClick={() => navigate('/dashboard')}
                    sx={{ 
                      mr: 2, 
                      color: 'white',
                      '&:hover': { 
                        background: 'rgba(255, 255, 255, 0.1)' 
                      }
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                      {tab?.name}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {tab?.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>

        {/* Members List */}
          <Grid item xs={12} md={4}>
            <motion.div
              key={`members-${tab?.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper 
                className="glass-card"
                sx={{ p: 2 }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Members
                </Typography>
                <List>
                  <AnimatePresence>
                    {Object.entries(tab?.memberDetails || {}).map(([uid, member], index) => (
                      <motion.div
                        key={`member-${tab?.id}-${uid}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar 
                              src={member.photoURL || undefined}
                              sx={{ 
                                bgcolor: 'primary.main',
                                width: 40,
                                height: 40
                              }}
                            >
                              {member.displayName?.[0] || member.email?.[0]?.toUpperCase() || '?'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography sx={{ color: 'white', fontWeight: 500 }}>
                                {member.displayName || member.email?.split('@')[0] || 'Unknown User'}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {balances.find(b => b.userId === member.uid)?.amount.toFixed(2) || '0.00'}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Typography 
                              sx={{ 
                                color: (balances.find(b => b.userId === member.uid)?.amount || 0) >= 0 
                                  ? 'success.main' 
                                  : 'error.main',
                                fontWeight: 600
                              }}
                            >
                              ${Math.abs(balances.find(b => b.userId === member.uid)?.amount || 0).toFixed(2)}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < Object.keys(tab?.memberDetails || {}).length - 1 && (
                          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </List>
              </Paper>
            </motion.div>
          </Grid>

          {/* Expense Breakdown */}
          <Grid item xs={12} md={8}>
            <motion.div
              key={`expenses-${tab?.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper 
                className="glass-card"
                sx={{ p: 2 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Expenses
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Scan Receipt">
                      <IconButton 
                        color="primary"
                        onClick={() => setOcrDialogOpen(true)}
                        disabled={addingExpense}
                        sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                      >
                        <ReceiptLongIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setManualExpenseDialogOpen(true)}
                      disabled={addingExpense}
                      sx={{
                        background: 'linear-gradient(45deg, #6B46C1 30%, #805AD5 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #553C9A 30%, #6B46C1 90%)',
                        }
                      }}
                    >
                      Add Expense
                    </Button>
                  </Box>
                </Box>

                {!tab?.expenses?.length ? (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '200px',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <Typography>No expenses added yet</Typography>
                  </Box>
                ) : (
                  <List>
                    {tab.expenses.map((expense, index) => (
                      <motion.div
                        key={`expense-${expense.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box>
                          {index > 0 && <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                ${expense.amount.toFixed(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography sx={{ color: 'white', fontWeight: 500 }}>
                                  {expense.description}
                                </Typography>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Paid by {tab.memberDetails[expense.paidBy]?.displayName || 'Unknown'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
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

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={manualExpenseDialogOpen}
        onClose={() => setManualExpenseDialogOpen(false)}
        onSubmit={handleAddExpense}
        loading={addingExpense}
      />

      {/* OCR Dialog will be added here */}
    </Box>
  );
}; 
