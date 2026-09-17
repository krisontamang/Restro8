import {createContext,useContext} from 'react';
import type {Session,User} from '@supabase/supabase-js';
export interface AuthState {session:Session|null;user:User|null;loading:boolean;error:string;recovery:boolean;signOut:()=>Promise<boolean>}
export const AuthContext = createContext<AuthState|null>(null);
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('AuthProvider is required.');return value;}
