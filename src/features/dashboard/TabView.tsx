import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTab, subscribeToTab, addManualExpense, createExpenseFromOCR } from "../../services/tabService";
import { toast } from "react-hot-toast";
import { Tab, Expense } from "../../types/tab";
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
  Divider,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { OCRUploader } from './OCRUploader';
import { AddExpenseDialog } from './AddExpenseDialog';

export const TabView = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab | null>(null);
  const [loading, setLoading] = useState(true);
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);
  const [scanningReceipt, setScanningReceipt] = useState(false);

  useEffect(() => {
    if (!tabId || !user) return;

    const loadTab = async () => {
      try {
        const tabData = await getTab(tabId);
        if (tabData) {
          setTab(tabData);
        }
      } catch (error) {
        console.error('Error loading tab:', error);
        toast.error('Failed to load tab');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = subscribeToTab(
      tabId,
      (updatedTab) => {
        setTab(updatedTab);
      },
      (error) => {
        console.error('Error in tab subscription:', error);
        toast.error('Failed to get real-time updates');
      }
    );

    loadTab();
    return () => unsubscribe();
  }, [tabId, user]);

  const handleScanClick = () => {
    setOcrDialogOpen(true);
  };

  const handleScanComplete = async (result: any) => {
    if (!tabId || !user) {
      toast.error('Please log in to add expenses');
      return;
    }
    
    try {
      setScanningReceipt(true);
      console.log('Processing OCR result:', result);
      
      await createExpenseFromOCR(tabId, user, result);
      toast.success('Receipt scanned and expense added successfully!');
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

  if (loading || !tab) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Container>
        <Typography variant="h4" sx={{ mb: 4 }}>
          {tab.name}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Members Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Members</Typography>
              <List>
                {Object.entries(tab.memberDetails).map(([uid, member], index) => (
                  <motion.div
                    key={`member-${uid}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={member.photoURL || undefined}>
                          {member.displayName?.charAt(0) || member.email?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.displayName || member.email}
                        secondary={`$${member.balance.toFixed(2)}`}
                      />
                    </ListItem>
                    {index < Object.keys(tab.memberDetails).length - 1 && <Divider />}
                  </motion.div>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Expenses Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Expenses</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleScanClick}
                    startIcon={<CameraAltIcon />}
                    disabled={scanningReceipt || addingExpense}
                    sx={{
                      background: 'linear-gradient(45deg, #FF0000 30%, #FF5555 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #CC0000 30%, #FF0000 90%)',
                      }
                    }}
                  >
                    Scan Receipt
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setAddExpenseDialogOpen(true)}
                    startIcon={<AddIcon />}
                    disabled={addingExpense || scanningReceipt}
                  >
                    Add Expense
                  </Button>
                </Box>
              </Box>

              <List>
                {tab.expenses.map((expense: Expense, index) => (
                  <motion.div
                    key={`expense-${expense.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>${expense.amount.toFixed(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={expense.description}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              Paid by {tab.memberDetails[expense.paidBy]?.displayName || 'Unknown'}
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                              ${expense.amount.toFixed(2)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < tab.expenses.length - 1 && <Divider />}
                  </motion.div>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        <OCRUploader
          open={ocrDialogOpen}
          onClose={() => setOcrDialogOpen(false)}
          onScanComplete={handleScanComplete}
          loading={scanningReceipt}
          tabId={tabId!}
        />

        <AddExpenseDialog
          open={addExpenseDialogOpen}
          onClose={() => setAddExpenseDialogOpen(false)}
          onSubmit={handleAddExpenseSubmit}
          loading={addingExpense}
        />
      </Container>
    </Box>
  );
}; 
