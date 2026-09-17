export type MenuCategory =
  | 'momo'
  | 'thakali_newari'
  | 'appetizers'
  | 'mains'
  | 'cafe_bakery'
  | 'beverages_bar'
  | 'desserts'
  | 'hookah';

export type KitchenStation = 'momo' | 'kitchen' | 'tandoor' | 'bar' | 'coffee';

export type TicketType = 'KOT' | 'BOT';

export type DietaryTag = 'veg' | 'vegan' | 'halal' | 'spicy' | 'chef-pick';

export interface MenuItemOption {
  name: string;
  choices: { label: string; extraPrice: number }[];
}

export interface MenuItem {
  id: string;
  name: string;
  nepaliName?: string;
  category: MenuCategory;
  price: number; // in NPR (Rs.)
  priceRange?: string; // e.g. "Rs 180 - Rs 250"
  cost: number;  // in NPR (Rs.)
  prepTimeMinutes: number;
  description: string;
  image: string;
  tags: DietaryTag[];
  inStock: boolean;
  stockQuantity: number;
  station: KitchenStation;
  ticketType: TicketType;
  options?: MenuItemOption[];
  isThakali?: boolean; // Can request complimentary Daal/Bhaat/Tarkari refills
  dishType?: string;   // e.g. "Non-Veg", "Veg"
  subMenu?: string;    // e.g. "Food Menu", "Cafe Menu"
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'dirty' | 'cleaning' | 'payment_pending';
export type DiningZone = 'rooftop' | 'cabin' | 'main' | 'garden' | 'bar';

export interface SplitTender {
  method: PaymentMethod;
  amount: number;
  reference?: string;
}

export interface SplitPaymentDetails {
  tenders: SplitTender[];
  changeReturned?: number;
}

export interface Table {
  id: string;
  number: number;
  label: string;
  zone: DiningZone;
  seats: number;
  status: TableStatus;
  serverName?: string;
  guestCount?: number;
  seatedTime?: string;
  currentOrderId?: string;
  totalAmount?: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  nepaliName?: string;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  notes?: string;
  station: KitchenStation;
  ticketType: TicketType;
  isCompleted?: boolean;
  isRefill?: boolean; // Complimentary Thakali refill (Rs. 0)
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery' | 'bar';
export type PaymentStatus = 'unpaid' | 'paid';
export type PaymentMethod = 'fonepay' | 'esewa' | 'khalti' | 'cash' | 'card' | 'split';
export type TaxMode = 'vat_registered' | 'pan_only';

export interface Order {
  id: string;
  orderNumber: number;
  invoiceNumber?: string;
  tableId?: string;
  tableNumber?: number;
  orderType: OrderType;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  dateBS: string;
  fiscalYear: string;
  serverName: string;
  customerName?: string;
  customerPhone?: string;
  customerPan?: string; // For B2B corporate tax invoices
  subtotal: number;     // Gross item sum in NPR
  taxableAmount: number;
  tax: number;          // 13% VAT (if vat_registered) or 0
  discount: number;
  tip: number;          // Voluntary gratuity only
  total: number;        // Final payable NPR
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  splitDetails?: SplitPaymentDetails;
  cancellationReason?: string;
  notes?: string;
  refillCount?: number; // Count of Thakali refills served
}

export interface ShiftRecord {
  id: string;
  shiftNumber: number;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingFloat: number; // in NPR
  cashSales: number;
  digitalSales: number;
  expectedCash: number;
  actualCash?: number;
  difference?: number;
  status: 'open' | 'closed';
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SmartInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'trend';
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  actionLabel?: string;
  actionTab?: string;
}

export type ReservationStatus = 'confirmed' | 'seated' | 'cancelled' | 'no-show';

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  partySize: number;
  date: string;
  time: string;
  zonePreference: DiningZone;
  status: ReservationStatus;
  isVip: boolean;
  notes?: string;
  assignedTableId?: string;
}

export type UserRole = 'manager' | 'waiter' | 'chef' | 'cashier';

export interface Customer {
  id: string;
  sn: number;
  name: string;
  avatar?: string;
  phone: string;
  email?: string;
  dob?: string;
  loyaltyDiscount: number; // in percentage e.g. 0.0 or 5.0
  openingBalanceType: 'collect_dr' | 'pay_cr';
  openingAmount: number; // in NPR
  group: 'VIP' | 'Regular' | 'Corporate' | 'Staff' | 'Family';
  dueAmount: number; // in NPR
  panNumber?: string;
  address?: string;
  notes?: string;
  createdAt?: string;
}

export interface StaffMember {
  id: string;
  sn: number;
  name: string;
  username: string;
  avatar?: string;
  role: 'SuperAdmin' | 'Admin' | 'Manager' | 'Cashier' | 'Waiter' | 'Chef';
  position: 'Owner' | 'Manager' | 'Head Chef' | 'Captain' | 'Cashier' | 'Barista';
  phone: string;
  email?: string;
  dueAmount?: number;
  status: 'active' | 'pending' | 'removed';
  createdAt?: string;
}

export interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  panNumber: string; // 9-digit IRD PAN
  taxMode: TaxMode;
  vatRate: number;   // 0.13 (13%)
  currency: string;  // 'Rs.'
}

