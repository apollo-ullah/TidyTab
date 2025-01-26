import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
  CollectionReference,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';

import {
  Tab,
  CreateTabInput,
  TabMember,
  TabStatus,
  Expense,
  ExpenseItem,
} from '../types/tab';
import { OCRResult } from '../services/ocrService';

const TABS_COLLECTION = 'tabs';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// ---------------------------
// Firestore Converter for Tab
// ---------------------------
const tabConverter: FirestoreDataConverter<Tab> = {
  toFirestore(tab: Tab): DocumentData {
    // Remove undefined values and handle resolvedAt properly
    const data = {
      name: tab.name,
      description: tab.description,
      category: tab.category,
      date: tab.date,
      createdAt: tab.createdAt,
      createdBy: tab.createdBy,
      members: tab.members,
      memberDetails: tab.memberDetails,
      expenses: tab.expenses || [],
      totalAmount: tab.totalAmount || 0,
      status: tab.status || 'active',
      resolvedAt: tab.resolvedAt || null // Ensure resolvedAt is never undefined
    } as Record<string, any>;

    // Remove any remaining undefined values
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });

    return data;
  },
  fromFirestore(snapshot: DocumentSnapshot): Tab {
    const data = snapshot.data()!;
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description,
      category: data.category,
      date: data.date?.toDate?.() || new Date(data.date),
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      createdBy: data.createdBy,
      members: data.members || [],
      memberDetails: data.memberDetails || {},
      expenses: data.expenses || [],
      totalAmount: data.totalAmount || 0,
      status: data.status || 'active',
      resolvedAt: data.resolvedAt?.toDate?.() || null
    };
  },
};

// Typed collection reference
const tabsCollection = collection(db, TABS_COLLECTION).withConverter(
  tabConverter
) as CollectionReference<Tab>;

// ----------------------
// Utility: Retry Wrapper
// ----------------------
async function retryOperation<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * 2 ** i));
    }
  }
  throw lastError;
}

// --------------------------
// Utility: Convert User -> Member
// --------------------------
function userToTabMember(user: User): TabMember {
  return {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName,
    photoURL: user.photoURL,
    balance: 0,
    joinedAt: new Date(),
  };
}

// --------------
// CREATE A NEW TAB
// --------------
export async function createTab(
  input: CreateTabInput,
  user: User
): Promise<string> {
  // The user becomes the first member
  const memberDetails = userToTabMember(user);

  const newTab: Omit<Tab, 'id'> = {
    name: input.name,
    description: input.description,
    category: input.category,
    date: input.date,
    createdAt: new Date(),
    createdBy: memberDetails, // The full user info of who created it
    members: [user.uid],      // Just store UIDs here
    memberDetails: {
      [user.uid]: memberDetails, // Store detailed member info in a map
    },
    expenses: [],
    totalAmount: 0,
    status: 'active',
  };

  // Firestore automatically creates an ID with addDoc
  const docRef = await addDoc(tabsCollection, newTab);
  return docRef.id;
}

// ----------
// JOIN A TAB
// ----------
export async function joinTab(tabId: string, user: User): Promise<Tab> {
  const tabRef = doc(tabsCollection, tabId);
  const tabSnap = await retryOperation(() => getDoc(tabRef));

  if (!tabSnap.exists()) {
    throw new Error('Tab not found');
  }
  const tab = tabSnap.data();

  // If already a member, just return
  if (tab.members.includes(user.uid)) {
    return tab;
  }

  // Otherwise, add them
  const newMember = userToTabMember(user);
  const updatedTabData: Partial<Tab> = {
    members: [...tab.members, user.uid],
    memberDetails: {
      ...tab.memberDetails,
      [user.uid]: newMember,
    },
  };

  await retryOperation(() => updateDoc(tabRef, updatedTabData));
  return { ...tab, ...updatedTabData };
}

// -------------
// GET ONE TAB
// -------------
export async function getTab(tabId: string): Promise<Tab | null> {
  const tabRef = doc(tabsCollection, tabId);
  const tabSnap = await retryOperation(() => getDoc(tabRef));

  if (!tabSnap.exists()) {
    return null;
  }
  return tabSnap.data();
}

// -----------------
// GET TABS FOR USER
// -----------------
export async function getUserTabs(
  user: User,
  status?: TabStatus
): Promise<Tab[]> {
  let q = query(tabsCollection, where('members', 'array-contains', user.uid));
  if (status) {
    q = query(q, where('status', '==', status));
  }

  const snapshot = await retryOperation(() => getDocs(q));
  return snapshot.docs.map((doc) => doc.data());
}

// -----------------------
// REALTIME TAB SUBSCRIBE
// -----------------------
export function subscribeToTab(
  tabId: string,
  onUpdate: (tab: Tab) => void,
  onError: (error: Error) => void
) {
  const tabRef = doc(tabsCollection, tabId);
  return onSnapshot(tabRef, {
    next: (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      }
    },
    error: onError,
    // If you want to track metadata, you can do so here:
    // includeMetadataChanges: true
  });
}

// -----------------
// RESOLVE A TAB
// -----------------
export async function resolveTab(tabId: string): Promise<void> {
  const tabRef = doc(tabsCollection, tabId);
  await retryOperation(() =>
    updateDoc(tabRef, {
      status: 'resolved',
      resolvedAt: new Date(),
    })
  );
}

// -----------------
// RE-OPEN A TAB
// -----------------
export async function reopenTab(tabId: string): Promise<void> {
  const tabRef = doc(tabsCollection, tabId);
  await retryOperation(() =>
    updateDoc(tabRef, {
      status: 'active',
      resolvedAt: null,
    })
  );
}

// --------------------------------------------------------
// HELPER: CREATE OR UPDATE AN EXPENSE INSIDE AN EXISTING TAB
// --------------------------------------------------------
async function createExpenseInTab(tabId: string, expense: Expense, tab: Tab) {
  const tabRef = doc(tabsCollection, tabId);

  // Current values
  const currentExpenses = tab.expenses ?? [];
  const currentTotal = tab.totalAmount ?? 0;
  const currentMembers = tab.members ?? [];
  const memberDetails = { ...tab.memberDetails };

  // Even-split calculation
  const splitAmount = expense.amount / currentMembers.length;

  // Update each member's balance
  currentMembers.forEach((uid) => {
    const existingBalance = memberDetails[uid]?.balance || 0;
    // The payer owes "splitAmount" less, effectively their share is 0
    // so they pay the total, but get credited the portion from others
    if (uid === expense.paidBy) {
      memberDetails[uid] = {
        ...memberDetails[uid],
        balance: existingBalance + (expense.amount - splitAmount),
      };
    } else {
      // Everyone else is debited their split
      memberDetails[uid] = {
        ...memberDetails[uid],
        balance: existingBalance - splitAmount,
      };
    }
  });

  // Prepare the merged doc update
  const updatedTab: Partial<Tab> = {
    expenses: [...currentExpenses, expense],
    totalAmount: currentTotal + expense.amount,
    memberDetails: memberDetails,
  };

  // Persist update
  await retryOperation(() => updateDoc(tabRef, updatedTab));
}

// -------------------------------------------
// CREATE EXPENSE FROM OCR (Auto-parsed data)
// -------------------------------------------
export async function createExpenseFromOCR(
  tabId: string,
  user: User,
  ocrResult: OCRResult,
  receiptURL?: string
) {
  const tabRef = doc(tabsCollection, tabId);
  const tabSnap = await retryOperation(() => getDoc(tabRef));

  if (!tabSnap.exists()) {
    throw new Error('Tab not found');
  }
  const tab = tabSnap.data();

  const expense: Expense = {
    id: uuidv4(),
    description: ocrResult.merchantName || 'Unknown Merchant',
    amount: ocrResult.totalCost || 0,
    date: new Date(),
    paidBy: user.uid,
    receiptURL,
    createdAt: new Date(),
    createdBy: user.uid,
    items: (ocrResult.lineItems || []).map((item) => ({
      name: item.name || 'Unknown Item',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      totalPrice: item.totalPrice || 0,
      // By default, each item is assigned to all members for even split
      assignedTo: [...(tab.members ?? [])],
    })),
  };

  await createExpenseInTab(tabId, expense, tab);
}

// ----------------------------------------------
// CREATE A MANUAL EXPENSE (User-input form data)
// ----------------------------------------------
interface ManualExpenseInput {
  description: string;
  amount: number;
  items: ExpenseItem[];
  paidBy: string;
  receiptURL?: string;
  createdBy: string;
}

export async function addManualExpense(
  tabId: string,
  user: User,
  input: ManualExpenseInput
) {
  const tabRef = doc(tabsCollection, tabId);
  const tabSnap = await getDoc(tabRef);

  if (!tabSnap.exists()) {
    throw new Error('Tab not found');
  }
  const tab = tabSnap.data();

  const newExpense: Expense = {
    id: uuidv4(),
    description: input.description,
    amount: input.amount,
    date: new Date(),
    paidBy: input.paidBy,
    createdAt: new Date(),
    createdBy: input.createdBy,
    receiptURL: input.receiptURL,
    items: input.items.map((item) => ({
      ...item,
      // If none assigned, default to all tab members
      assignedTo: item.assignedTo?.length
        ? item.assignedTo
        : Object.keys(tab.memberDetails || {}),
      quantity: item.quantity ?? 1,
      // Fall back to unitPrice or compute from totalPrice
      unitPrice: item.unitPrice ?? item.totalPrice ?? 0,
      totalPrice:
        item.totalPrice ??
        (item.unitPrice || 0) * (item.quantity || 1) ??
        0,
    })),
  };

  await createExpenseInTab(tabId, newExpense, tab);
}
