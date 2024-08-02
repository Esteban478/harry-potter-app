import { Character, Options, Spell, UserProfile } from ".";
import { User } from 'firebase/auth';


export interface AppContextType {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  spells: Spell[];
  setSpells: React.Dispatch<React.SetStateAction<Spell[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

export interface DataContextType {
  characters: Character[];
  spells: Spell[];
  options: Options | null;
  loading: boolean;
  error: string | null;
}

export interface UserContextType {
  userProfile: UserProfile | null;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}