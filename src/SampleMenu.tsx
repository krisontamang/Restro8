import {PublicMenuProvider} from './context/PublicMenuContext';
import {PublicMenuView} from './components/menu/PublicMenuView';
export default function SampleMenu() {
  return (
    <PublicMenuProvider>
      <PublicMenuView />
    </PublicMenuProvider>
  );
}
