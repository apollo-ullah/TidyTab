export type TabStatus = 'active' | 'resolved';

export interface TabMember {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  balance: number;
  joinedAt: Date;
}

export type TabCategory = 'restaurant' | 'activities' | 'other';

export interface ExpenseItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  assignedTo: string[]; // Array of user UIDs
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  paidBy: string; // User UID
  receiptURL?: string;
  items: ExpenseItem[];
  createdAt: Date;
  createdBy: string; // User UID
}

export interface Tab {
  id: string;
  name: string;
  description: string;
  category: TabCategory;
  date: Date;
  createdAt: Date;
  createdBy: TabMember;
  members: string[]; // Array of user UIDs
  memberDetails: { [uid: string]: TabMember }; // Map of user UIDs to member details
  expenses: Expense[];
  totalAmount: number;
  status: TabStatus;
  resolvedAt?: Date;
}

export interface CreateTabInput {
  name: string;
  description: string;
  category: TabCategory;
  date: Date;
}

export interface Balance {
  userId: string;
  amount: number;
  owes: { [userId: string]: number }; // who they owe money to
  owed: { [userId: string]: number }; // who owes them money
} 