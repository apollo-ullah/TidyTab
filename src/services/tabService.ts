import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, onSnapshot, DocumentSnapshot, DocumentData, DocumentReference, WithFieldValue, UpdateData } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';
import { Tab, CreateTabInput, TabMember, TabStatus, Expense, ExpenseItem } from '../types/tab';
import { OCRResult } from '../services/ocrService';

const TABS_COLLECTION = 'tabs';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createTabId = () => {
  // Create a shorter, more user-friendly ID
  return uuidv4().slice(0, 8);
};

const userToTabMember = (user: User): TabMember => {
  // Create a stable member object without the joinedAt field
  const stableMember = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName,
    photoURL: user.photoURL,
    balance: 0
  };
  
  // Add joinedAt only when creating a new member
  return {
    ...stableMember,
    joinedAt: new Date()
  };
};

const retryOperation = async <T>(operation: () => Promise<T>): Promise<T> => {
  let lastError: Error | null = null;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      await wait(RETRY_DELAY * Math.pow(2, i));
    }
  }
  throw lastError;
};

export const createTab = async (input: CreateTabInput, user: User): Promise<string> => {
  try {
    const tabRef = doc(collection(db, 'tabs'));
    
    // Create member details object
    const memberDetails = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName,
      photoURL: user.photoURL,
      balance: 0,
      joinedAt: new Date()
    };

    const newTab: Omit<Tab, 'id'> = {
      name: input.name,
      description: input.description,
      category: input.category,
      date: input.date,
      createdAt: new Date(),
      createdBy: memberDetails,
      members: [user.uid], // Store only UIDs in members array
      memberDetails: { // Store full member details in a map
        [user.uid]: memberDetails
      },
      expenses: [],
      totalAmount: 0,
      status: 'active'
    };

    console.log('Creating new tab with structure:', JSON.stringify({
      ...newTab,
      members: newTab.members,
      memberDetails: newTab.memberDetails
    }, null, 2));
    
    await setDoc(tabRef, newTab);
    console.log('Tab created with ID:', tabRef.id);
    
    // Verify the tab was stored correctly
    const verifyDoc = await getDoc(tabRef);
    const verifyData = verifyDoc.data();
    console.log('Verification - stored tab data:', {
      id: tabRef.id,
      name: verifyData?.name,
      members: verifyData?.members,
      memberDetails: verifyData?.memberDetails
    });
    
    return tabRef.id;
  } catch (error) {
    console.error('Error creating tab:', error);
    throw error;
  }
};

export const joinTab = async (tabId: string, user: User): Promise<Tab> => {
  const tabRef = doc(db, TABS_COLLECTION, tabId);
  const tabDoc = await retryOperation(() => getDoc(tabRef));

  if (!tabDoc.exists()) {
    throw new Error('Tab not found');
  }

  const tab = tabDoc.data() as Tab;
  
  // Check if user is already a member
  if (tab.members.includes(user.uid)) {
    return tab;
  }

  // Create member details
  const memberDetails = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName,
    photoURL: user.photoURL,
    balance: 0,
    joinedAt: new Date()
  };

  // Update the tab with new member
  const updates = {
    members: [...tab.members, user.uid],
    memberDetails: {
      ...tab.memberDetails,
      [user.uid]: memberDetails
    }
  };

  await retryOperation(() => updateDoc(tabRef, updates));

  return {
    ...tab,
    ...updates
  };
};

export const getTab = async (tabId: string): Promise<Tab | null> => {
  try {
    const tabDoc = await retryOperation(() => getDoc(doc(db, TABS_COLLECTION, tabId)));
    if (!tabDoc.exists()) return null;

    const data = tabDoc.data();
    return {
      ...data,
      id: tabDoc.id,
      members: data.members || [],
      expenses: data.expenses || [],
      totalAmount: data.totalAmount || 0,
    } as Tab;
  } catch (error) {
    console.error('Error getting tab:', error);
    throw error;
  }
};

export const getUserTabs = async (user: User, status?: TabStatus): Promise<Tab[]> => {
  try {
    console.log('Getting tabs for user:', user.uid, 'with status:', status);
    const tabsRef = collection(db, TABS_COLLECTION);
    
    // Query using just the UID
    let q = query(
      tabsRef,
      where('members', 'array-contains', user.uid)
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    const querySnapshot = await retryOperation(() => getDocs(q));
    console.log('Found tabs:', querySnapshot.docs.length);
    
    // Add more detailed logging
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log('Raw tab data:', {
        id: doc.id,
        name: data.name,
        members: data.members,
        memberDetails: data.memberDetails,
        status: data.status
      });
    });
    
    const tabs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        date: data.date?.toDate?.() || new Date(data.date),
        memberDetails: Object.entries(data.memberDetails || {}).reduce((acc, [uid, member]: [string, any]) => ({
          ...acc,
          [uid]: {
            ...member,
            joinedAt: member.joinedAt?.toDate?.() || new Date(member.joinedAt)
          }
        }), {}),
        expenses: data.expenses?.map((expense: any) => ({
          ...expense,
          date: expense.date?.toDate?.() || new Date(expense.date),
          createdAt: expense.createdAt?.toDate?.() || new Date(expense.createdAt)
        })) || [],
        totalAmount: data.totalAmount || 0,
        status: data.status || 'active',
        resolvedAt: data.resolvedAt?.toDate?.() || (data.resolvedAt ? new Date(data.resolvedAt) : undefined)
      } as Tab;
    });
    
    console.log('Processed tabs:', tabs);
    return tabs;
  } catch (error) {
    console.error('Error getting user tabs:', error);
    throw error;
  }
};

export const subscribeToTab = (
  tabId: string,
  onUpdate: (tab: Tab) => void,
  onError: (error: Error) => void
) => {
  return onSnapshot(
    doc(db, TABS_COLLECTION, tabId),
    (doc: DocumentSnapshot<DocumentData>) => {
      if (doc.exists()) {
        const data = doc.data();
        onUpdate({
          ...data,
          id: doc.id,
          members: data.members || [],
          expenses: data.expenses || [],
          totalAmount: data.totalAmount || 0,
        } as Tab);
      }
    },
    onError,
    { includeMetadataChanges: true }
  );
};

export const resolveTab = async (tabId: string): Promise<void> => {
  try {
    const tabRef = doc(db, TABS_COLLECTION, tabId);
    await retryOperation(() => 
      updateDoc(tabRef, {
        status: 'resolved',
        resolvedAt: new Date()
      })
    );
  } catch (error) {
    console.error('Error resolving tab:', error);
    throw error;
  }
};

export const reopenTab = async (tabId: string): Promise<void> => {
  try {
    const tabRef = doc(db, TABS_COLLECTION, tabId);
    await retryOperation(() => 
      updateDoc(tabRef, {
        status: 'active',
        resolvedAt: null
      })
    );
  } catch (error) {
    console.error('Error reopening tab:', error);
    throw error;
  }
};

export const createExpenseFromOCR = async (
  tabId: string,
  user: User,
  ocrResult: OCRResult,
  receiptURL?: string
): Promise<void> => {
  console.log('Creating expense from OCR result:', ocrResult);
  
  const tabRef = doc(db, TABS_COLLECTION, tabId);
  const tabDoc = await retryOperation(() => getDoc(tabRef));

  if (!tabDoc.exists()) {
    throw new Error('Tab not found');
  }

  const tab = tabDoc.data() as Tab;

  // Safely handle existing fields with defaults
  const currentExpenses = Array.isArray(tab.expenses) ? tab.expenses : [];
  const currentMemberDetails = tab.memberDetails || {};
  const currentTotalAmount = tab.totalAmount || 0;

  // Create the expense object
  const expense: Expense = {
    id: uuidv4(),
    description: ocrResult.merchantName || 'Unknown Merchant',
    amount: ocrResult.totalCost || 0,
    date: new Date(),
    paidBy: user.uid,
    receiptURL,
    items: (ocrResult.lineItems || []).map(item => ({
      name: item.name || 'Unknown Item',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      totalPrice: item.totalPrice || 0,
      assignedTo: tab.members // Assign to all members by default for even split
    })),
    createdAt: new Date(),
    createdBy: user.uid
  };

  // Calculate even split amount
  const splitAmount = expense.amount / tab.members.length;
  console.log('Split amount per member:', splitAmount);

  // Update member balances with the split amount
  const updatedMemberDetails = { ...currentMemberDetails };
  tab.members.forEach(memberUid => {
    const currentBalance = updatedMemberDetails[memberUid]?.balance || 0;
    updatedMemberDetails[memberUid] = {
      ...updatedMemberDetails[memberUid],
      balance: currentBalance + (memberUid === user.uid ? expense.amount - splitAmount : splitAmount)
    };
  });

  // Prepare updates with safe merging
  const updates = {
    expenses: [...currentExpenses, expense],
    totalAmount: currentTotalAmount + expense.amount,
    memberDetails: updatedMemberDetails
  };

  console.log('Updating tab with:', {
    expenseId: expense.id,
    amount: expense.amount,
    items: expense.items.length,
    memberUpdates: Object.fromEntries(
      Object.entries(updatedMemberDetails).map(([uid, member]) => [
        uid,
        { balance: member.balance }
      ])
    )
  });

  try {
    await retryOperation(() => updateDoc(tabRef, updates));
    console.log('Expense created successfully');
  } catch (error) {
    console.error('Error updating tab with expense:', error);
    throw new Error('Failed to create expense. Please try again.');
  }
};

interface ManualExpenseInput {
  description: string;
  amount: number;
  items: ExpenseItem[];
  paidBy: string;
  receiptURL?: string;
  createdBy: string;
}

export const addManualExpense = async (tabId: string, user: User, expenseInput: ManualExpenseInput): Promise<void> => {
  console.log("Adding manual expense:", expenseInput);
  
  const tabRef = doc(db, TABS_COLLECTION, tabId);
  const tabDoc = await getDoc(tabRef);
  
  if (!tabDoc.exists()) {
    throw new Error("Tab not found");
  }

  const tab = tabDoc.data() as Tab;
  const currentExpenses = Array.isArray(tab.expenses) ? tab.expenses : [];
  const currentTotalAmount = tab.totalAmount || 0;
  const currentMemberDetails = tab.memberDetails || {};

  // Create the expense object with all required fields
  const newExpense: Expense = {
    id: uuidv4(),
    description: expenseInput.description,
    amount: expenseInput.amount,
    date: new Date(), // Use current date
    paidBy: expenseInput.paidBy,
    ...(expenseInput.receiptURL ? { receiptURL: expenseInput.receiptURL } : {}),
    items: expenseInput.items.map(item => ({
      ...item,
      assignedTo: item.assignedTo?.length ? item.assignedTo : Object.keys(currentMemberDetails),
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || item.totalPrice || 0,
      totalPrice: item.totalPrice || (item.unitPrice * (item.quantity || 1)) || 0
    })),
    createdAt: new Date(),
    createdBy: expenseInput.createdBy
  };

  // Calculate even split amount
  const memberCount = Object.keys(currentMemberDetails).length;
  const splitAmount = memberCount > 0 ? newExpense.amount / memberCount : 0;
  console.log("Split amount per member:", splitAmount);

  // Update member balances with the split amount
  const updatedMemberDetails = { ...currentMemberDetails };
  Object.keys(currentMemberDetails).forEach(memberUid => {
    const member = updatedMemberDetails[memberUid];
    if (!member) return;
    
    const currentBalance = member.balance || 0;
    updatedMemberDetails[memberUid] = {
      ...member,
      balance: currentBalance + (memberUid === newExpense.paidBy ? 
        newExpense.amount - splitAmount : 
        -splitAmount)
    };
  });

  // Prepare updates with safe merging
  const updates: UpdateData<Tab> = {
    expenses: [...currentExpenses, newExpense],
    totalAmount: currentTotalAmount + newExpense.amount,
    memberDetails: updatedMemberDetails
  };

  console.log("Updating tab with:", {
    expenseId: newExpense.id,
    amount: newExpense.amount,
    items: newExpense.items.length,
    memberUpdates: Object.fromEntries(
      Object.entries(updatedMemberDetails).map(([uid, member]) => [
        uid,
        { balance: member.balance }
      ])
    )
  });

  try {
    await updateDoc(tabRef, updates);
    console.log("Manual expense added successfully");
  } catch (error) {
    console.error("Error updating tab with manual expense:", error);
    throw new Error("Failed to add manual expense. Please try again.");
  }
}; 