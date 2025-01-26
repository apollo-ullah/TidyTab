import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';
import { Tab, CreateTabInput, TabMember } from '../types/tab';

const TABS_COLLECTION = 'tabs';

const createTabId = () => {
  // Create a shorter, more user-friendly ID
  return uuidv4().slice(0, 8);
};

const userToTabMember = (user: User): TabMember => ({
  uid: user.uid,
  email: user.email!,
  displayName: user.displayName,
  photoURL: user.photoURL,
  joinedAt: new Date(),
});

export const createTab = async (input: CreateTabInput, user: User): Promise<Tab> => {
  const tabId = createTabId();
  const member = userToTabMember(user);
  
  const newTab: Tab = {
    id: tabId,
    name: input.name,
    description: input.description,
    createdAt: new Date(),
    createdBy: member,
    members: [member],
  };

  await setDoc(doc(db, TABS_COLLECTION, tabId), newTab);
  return newTab;
};

export const joinTab = async (tabId: string, user: User): Promise<Tab> => {
  const tabRef = doc(db, TABS_COLLECTION, tabId);
  const tabDoc = await getDoc(tabRef);

  if (!tabDoc.exists()) {
    throw new Error('Tab not found');
  }

  const tab = tabDoc.data() as Tab;
  const member = userToTabMember(user);

  if (tab.members.some(m => m.uid === user.uid)) {
    return tab;
  }

  const updatedMembers = [...tab.members, member];
  await updateDoc(tabRef, { members: updatedMembers });

  return { ...tab, members: updatedMembers };
};

export const getTab = async (tabId: string): Promise<Tab | null> => {
  const tabDoc = await getDoc(doc(db, TABS_COLLECTION, tabId));
  return tabDoc.exists() ? tabDoc.data() as Tab : null;
};

export const getUserTabs = async (user: User): Promise<Tab[]> => {
  const q = query(
    collection(db, TABS_COLLECTION),
    where('members', 'array-contains', { uid: user.uid })
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Tab);
};

export const subscribeToTab = (
  tabId: string,
  onUpdate: (tab: Tab) => void,
  onError: (error: Error) => void
) => {
  return onSnapshot(
    doc(db, TABS_COLLECTION, tabId),
    (doc) => {
      if (doc.exists()) {
        onUpdate(doc.data() as Tab);
      }
    },
    onError
  );
}; 