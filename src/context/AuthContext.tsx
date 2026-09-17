import { useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContext } from './authState';
type Verification = { token: string | null; user: User | null; error: string };
const empty: Verification = {token:null,user:null,error:''};
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session,setSession] = useState<Session | null>(null);
  const [verified,setVerified] = useState<Verification>(empty);
  const [initializing,setInitializing] = useState(Boolean(supabase));
  const [error,setError] = useState('');
  const [recovery,setRecovery] = useState(false);
  const token = session?.access_token ?? null;
  useEffect(() => {
    if (!supabase) return;
    let mounted = true, receivedEvent = false;
    const {data:{subscription}} = supabase.auth.onAuthStateChange((event,next) => {
      if (!mounted) return;
      receivedEvent = true; setSession(next); setInitializing(false); setError('');
      if (!next) {setVerified(empty);setRecovery(false);}
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
    });
    supabase.auth.getSession().then(({data,error:failure}) => {
      if (!mounted || receivedEvent) return;
      setSession(data.session);setInitializing(false);
      if(failure) setError('Your session could not be restored. Please sign in again.');
    }).catch(()=>{if(mounted && !receivedEvent){setInitializing(false);setError('Unable to reach the account service.');}});
    return()=>{mounted=false;subscription.unsubscribe();};
  },[]);
  useEffect(() => {
    if(!supabase || !token) return;
    let mounted = true;
    // Cached sessions and locally selected roles never establish verified access.
    supabase.auth.getUser(token).then(({data,error:failure})=>{
      if(!mounted) return;
      const valid = !failure && data.user?.email_confirmed_at && !data.user.is_anonymous;
      setVerified({token,user:valid ? data.user : null,error:valid ? '' : 'Please sign in with a verified account to continue.'});
    }).catch(()=>{if(mounted)setVerified({token,user:null,error:'Your account could not be verified. Please try again.'});});
    return()=>{mounted=false;};
  },[token]);
  async function signOut() {
    if(!supabase) return true;
    try {
      const {error:failure} = await supabase.auth.signOut({scope:'local'});
      if(failure){setError('Sign-out failed. Please try again.');return false;}
      setSession(null);setVerified(empty);setRecovery(false);setError('');return true;
    }catch{setError('Sign-out failed. Please try again.');return false;}
  }
  const loading = initializing || Boolean(token && verified.token !== token);
  const user = token && !loading ? verified.user : null;
  return <AuthContext.Provider value={{session,user,loading,error:error || (verified.token === token ? verified.error : ''),recovery,signOut}}>{children}</AuthContext.Provider>;
}
