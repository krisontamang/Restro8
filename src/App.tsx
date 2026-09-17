import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/authState';
import { resolvePublicRoute } from './lib/accountRules';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
const LandingPageView = lazy(() => import('./components/landing/LandingPageView').then(m => ({default:m.LandingPageView})));
const AuthDashboardView = lazy(() => import('./components/auth/AuthDashboardView').then(m => ({default:m.AuthDashboardView})));
const AccountPage = lazy(() => import('./components/account/AccountPage').then(m => ({default:m.AccountPage})));
// The legacy local-data workspace is excluded from production routes and chunks.
const DemoWorkspace = import.meta.env.DEV ? lazy(() => import('./DemoWorkspace')) : null;
const SampleMenu = import.meta.env.DEV ? lazy(() => import('./SampleMenu')) : null;
const readRoute = () => resolvePublicRoute(window.location.pathname, window.location.search);
function Loading() { return <div className="site-root site-loading" role="status"><span className="site-loading-mark"/>Opening Restro8…</div>; }
function Routes() {
  const [route,setRoute] = useState(readRoute);
  const {user,loading} = useAuth();
  const navigate = useCallback((path:string) => {
    window.history.pushState(null,'',path); setRoute(readRoute()); window.scrollTo(0,0);
  },[]);
  useEffect(() => { const pop=()=>setRoute(readRoute()); window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop); },[]);
  useEffect(() => { document.title = route === 'landing' ? 'Restro8 · Less admin. More hospitality.' : route === 'account' ? 'Your account · Restro8' : route === 'demo' ? 'Development preview · Restro8' : 'Welcome · Restro8'; },[route]);
  if (route === 'landing') return <LandingPageView onNavigateLogin={()=>navigate('/login')} onNavigateRegister={()=>navigate('/signup')}/>;
  if (route === 'account') return loading ? <Loading/> : user ? <AccountPage onNavigate={navigate}/> : <AuthDashboardView key="login" mode="login" onNavigate={navigate}/>;
  if (['login','signup','forgot','reset','callback'].includes(route)) return <AuthDashboardView key={route} mode={route as 'login'|'signup'|'forgot'|'reset'|'callback'} onNavigate={navigate}/>;
  if (route === 'demo' && DemoWorkspace) return <DemoWorkspace onNavigate={navigate}/>;
  if (route === 'menu' && SampleMenu) return <SampleMenu/>;
  return <div className="site-root site-loading"><h1>{route === 'menu' ? 'This menu is not published yet.' : 'A little off the menu.'}</h1><p>{route === 'menu' ? 'Ask your restaurant for its live menu link. Sample data is not used for live orders.' : 'This page is not available.'}</p><button className="site-button" type="button" onClick={()=>navigate('/')}>Back to Restro8</button></div>;
}
export default function App() { return <ErrorBoundary><AuthProvider><Suspense fallback={<Loading/>}><Routes/></Suspense></AuthProvider></ErrorBoundary>; }
