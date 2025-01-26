export interface TabMember {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  joinedAt: Date;
}

export type TabCategory = 'restaurant' | 'activities' | 'other';

export interface Tab {
  id: string;
  name: string;
  description?: string;
  category: TabCategory;
  createdAt: Date;
  createdBy: TabMember;
  members: TabMember[];
}

export interface CreateTabInput {
  name: string;
  description?: string;
  category: TabCategory;
} 