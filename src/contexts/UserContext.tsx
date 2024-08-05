import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';

export interface UserContextType {
  userProfile: UserProfile | null;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          const newUserProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            nickname: null,
            profilePicture: null,
            favoriteHouse: null,
            favoriteSpell: null,
            favoriteCharacter: null,
            wandCore: null,
            wandWood: null,
            wandLength: null,
            patronus: null,
            quidditchPosition: null,
            hogwartsYear: null,
            biography: null,
          };
          await setDoc(userDocRef, newUserProfile);
          setUserProfile(newUserProfile);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...data };
      const userDocRef = doc(db, 'users', userProfile.uid);
      try {
        await setDoc(userDocRef, updatedProfile, { merge: true });
        setUserProfile(updatedProfile);
        console.log('User profile updated successfully:', updatedProfile);
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};