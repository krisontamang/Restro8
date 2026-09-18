import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/authState';
import { getAppUrl, isAppHost, resolvePublicRoute } from './lib/accountRules';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
const LandingPageView = lazy(() => import('./components/landing/LandingPageView').then(m => ({default:m.LandingPageView})));
const AuthDashboardView = lazy(() => import('./components/auth/AuthDashboardView').then(m => ({default:m.AuthDashboardView})));
const AccountPage = lazy(() => import('./components/account/AccountPage').then(m => ({default:m.AccountPage})));
// Operational restaurant workspace enabled for development and production deployments.
const DemoWorkspace = import.meta.env.DEV ? lazy(() => import('./DemoWorkspace')) : lazy(() => import('./DemoWorkspace'));
const SampleMenu = import.meta.env.DEV ? lazy(() => import('./SampleMenu')) : lazy(() => import('./SampleMenu'));
const readRoute = () => resolvePublicRoute(window.location.pathname, window.location.search);
function Loading() { return <div className="site-root site-loading" role="status"><span className="site-loading-mark"/>Opening Restro8…</div>; }
function Routes() {
  const [route,setRoute] = useState(readRoute);
  const {user,loading} = useAuth();
  const navigate = useCallback((path:string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      window.location.href = path;
      return;
    }
    window.history.pushState(null,'',path); setRoute(readRoute()); window.scrollTo(0,0);
  },[]);
  useEffect(() => { const pop=()=>setRoute(readRoute()); window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop); },[]);
  useEffect(() => {
    const isWorkspace = ['/workspace', '/app', '/pos', '/dashboard', '/demo'].includes(window.location.pathname.toLowerCase().replace(/\/$/, '')) || (isAppHost() && Boolean(user));
    document.title = (!isAppHost() && route === 'landing') ? 'Restro8 · Less admin. More hospitality.' : isWorkspace ? 'Restaurant Workspace · Restro8' : route === 'account' ? 'Your account · Restro8' : 'Welcome · Restro8';
  },[route, user]);
  if (route === 'landing' && !isAppHost()) return <LandingPageView onNavigateLogin={()=>navigate(getAppUrl('/login'))} onNavigateRegister={()=>navigate(getAppUrl('/signup'))}/>;
  if (route === 'account' || (route === 'landing' && isAppHost())) {
    if (loading) return <Loading/>;
    if (!user) return <AuthDashboardView key="login" mode="login" onNavigate={navigate}/>;
    const isWorkspace = ['/workspace', '/app', '/pos', '/dashboard'].includes(window.location.pathname.toLowerCase().replace(/\/$/, '')) || (isAppHost() && window.location.pathname.toLowerCase().replace(/\/$/, '') !== '/account');
    if (isWorkspace && DemoWorkspace) return <DemoWorkspace onNavigate={navigate}/>;
    return <AccountPage onNavigate={navigate}/>;
  }
  if (['login','signup','forgot','reset','callback'].includes(route)) return <AuthDashboardView key={route} mode={route as 'login'|'signup'|'forgot'|'reset'|'callback'} onNavigate={navigate}/>;
  if (route === 'demo' && DemoWorkspace) return <DemoWorkspace onNavigate={navigate}/>;
  if (route === 'menu' && SampleMenu) return <SampleMenu/>;
  return <div className="site-root site-loading"><h1>{route === 'menu' ? 'This menu is not published yet.' : 'A little off the menu.'}</h1><p>{route === 'menu' ? 'Ask your restaurant for its live menu link. Sample data is not used for live orders.' : 'This page is not available.'}</p><button className="site-button" type="button" onClick={()=>navigate(isAppHost() ? '/login' : '/')}>{isAppHost() ? 'Go to Login' : 'Back to Restro8'}</button></div>;
}
export default function App() { return <ErrorBoundary><AuthProvider><Suspense fallback={<Loading/>}><Routes/></Suspense></AuthProvider></ErrorBoundary>; }
