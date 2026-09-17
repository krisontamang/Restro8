import {PublicMenuProvider} from './context/PublicMenuContext';
import {PublicMenuView} from './components/menu/PublicMenuView';
export default function SampleMenu() {return <><div className="development-preview-banner" role="status">Development menu · Orders are local to this browser, not sent to a live restaurant</div><PublicMenuProvider><PublicMenuView/></PublicMenuProvider></>;}
