import { useRef, useState } from 'react';
import { Printer, Tv } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { Order } from '../../types/restaurant';
import { Modal } from '../ui/Modal';
import { ActionButton } from '../ui/Workspace';
import { KitchenTicket } from '../kds/KitchenTicket';
import { kitchenTicketData, type KitchenTicketData } from '../../utils/kitchenTicket';
import { printDocument } from '../../lib/printDocument';

export interface KOTModalProps { isOpen: boolean; onClose: () => void; order?: Order | null; customData?: KitchenTicketData | null }
export function KOTModal({ isOpen, onClose, order, customData }: KOTModalProps) {
  const { setActiveTab, settings, tables } = useRestaurant();
  const paper = useRef<HTMLDivElement>(null);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState('');
  const data = customData || (order ? kitchenTicketData(order, tables) : null);
  async function print() {
    if (!paper.current || !data) return;
    setPrinting(true); setError('');
    try { await printDocument(paper.current, 'KOT ' + data.kotNumber); }
    catch { setError('Print preview could not open. Please try again.'); }
    finally { setPrinting(false); }
  }
  return <Modal isOpen={isOpen} onClose={onClose} title="Kitchen ticket" description="Plain print · select 80 mm paper in your printer settings" size="sm" className="kot-dialog" footer={<>
    <ActionButton onClick={() => { onClose(); setActiveTab('kds'); }}><Tv size={16} aria-hidden="true" />Kitchen</ActionButton>
    <ActionButton primary disabled={!data || printing} onClick={print}><Printer size={16} aria-hidden="true" />{printing ? 'Opening…' : 'Print KOT'}</ActionButton>
  </>}>
    {error && <p role="alert">{error}</p>}
    {data ? <div ref={paper}><KitchenTicket data={data} restaurant={settings.name} /></div> : <p>No ticket selected.</p>}
  </Modal>;
}
