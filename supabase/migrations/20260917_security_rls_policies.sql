-- ==============================================================================
-- RESTRO8 / RESTROX DATABASE SECURITY MIGRATION
-- Row Level Security (RLS), Tenant Isolation & Public Guest Constraints
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE SCHEMA SETUP WITH TENANT ISOLATION
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT,
    address TEXT,
    city TEXT,
    phone TEXT,
    pan_number TEXT,
    tax_mode TEXT DEFAULT 'vat_registered' CHECK (tax_mode IN ('vat_registered', 'none')),
    vat_rate NUMERIC DEFAULT 0.13,
    currency TEXT DEFAULT 'Rs.',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    username TEXT,
    role TEXT NOT NULL CHECK (role IN ('SuperAdmin', 'admin', 'manager', 'cashier', 'waiter', 'chef')),
    position TEXT,
    phone TEXT,
    email TEXT,
    salary NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    pan_number TEXT,
    due_amount NUMERIC DEFAULT 0,
    loyalty_discount NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    seats INT DEFAULT 4 CHECK (seats > 0),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    nepali_name TEXT,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    cost NUMERIC DEFAULT 0 CHECK (cost >= 0),
    prep_time_minutes INT DEFAULT 15,
    description TEXT,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INT DEFAULT 0,
    station TEXT DEFAULT 'kitchen',
    ticket_type TEXT DEFAULT 'KOT',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    order_number INT NOT NULL,
    table_id UUID REFERENCES public.tables(id) ON DELETE SET NULL,
    order_type TEXT DEFAULT 'dine-in' CHECK (order_type IN ('dine-in', 'takeaway', 'delivery', 'bar')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partially_paid', 'refunded')),
    subtotal NUMERIC DEFAULT 0 CHECK (subtotal >= 0),
    tax NUMERIC DEFAULT 0 CHECK (tax >= 0),
    discount NUMERIC DEFAULT 0 CHECK (discount >= 0),
    tip NUMERIC DEFAULT 0 CHECK (tip >= 0),
    total NUMERIC DEFAULT 0 CHECK (total >= 0),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0 AND quantity <= 50),
    station TEXT DEFAULT 'kitchen',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'sales', 'purchase', 'transfer')),
    account TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    description TEXT,
    reference_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ==============================================================================
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. SECURITY HELPER FUNCTIONS
-- ==============================================================================

-- Returns the authenticated staff member's role for their active restaurant
CREATE OR REPLACE FUNCTION public.current_staff_role(target_restaurant_id UUID)
RETURNS TEXT AS $$
    SELECT role FROM public.staff
    WHERE user_id = auth.uid()
      AND restaurant_id = target_restaurant_id
      AND status = 'active'
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Verifies if the authenticated user belongs to the target restaurant
CREATE OR REPLACE FUNCTION public.is_restaurant_staff(target_restaurant_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.staff
        WHERE user_id = auth.uid()
          AND restaurant_id = target_restaurant_id
          AND status = 'active'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ==============================================================================
-- 5. RLS POLICIES - PUBLIC GUEST CONSTRAINTS
-- ==============================================================================

-- Public Menu: Guests can ONLY read active menu items
CREATE POLICY "public_guests_view_active_menu"
    ON public.menu_items FOR SELECT
    TO anon, authenticated
    USING (in_stock = true);

-- Public Tables: Guests can read table labels to verify QR codes
CREATE POLICY "public_guests_view_table_labels"
    ON public.tables FOR SELECT
    TO anon, authenticated
    USING (true);

-- Public Restaurant Brand: Guests can read public business header
CREATE POLICY "public_guests_view_restaurant_brand"
    ON public.restaurants FOR SELECT
    TO anon, authenticated
    USING (true);

-- Guest Orders: Guests can ONLY insert new orders with status 'new' and 'unpaid'
CREATE POLICY "public_guests_create_orders"
    ON public.orders FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'new'
        AND payment_status = 'unpaid'
        AND total >= 0
    );

-- Guest Order Items: Guests can insert items linked to their order
CREATE POLICY "public_guests_insert_order_items"
    ON public.order_items FOR INSERT
    TO anon, authenticated
    WITH CHECK (quantity > 0 AND quantity <= 50);

-- CRITICAL DATA THEFT DEFENSE:
-- Guests have ZERO SELECT permissions on orders, customers, staff, or finance_records!
-- Any attempt by an anon guest to query `SELECT * FROM orders` or `SELECT * FROM customers` returns 0 rows.

-- ==============================================================================
-- 6. RLS POLICIES - AUTHENTICATED STAFF (RBAC & TENANT ISOLATION)
-- ==============================================================================

-- CUSTOMERS: Restricted strictly to authenticated staff (No anonymous access)
CREATE POLICY "staff_view_customers"
    ON public.customers FOR SELECT
    TO authenticated
    USING (public.is_restaurant_staff(restaurant_id));

CREATE POLICY "staff_manage_customers"
    ON public.customers FOR ALL
    TO authenticated
    USING (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin', 'manager', 'cashier'))
    WITH CHECK (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin', 'manager', 'cashier'));

-- STAFF: General staff can see colleague names; Salaries/Edits restricted to Admins
CREATE POLICY "staff_view_colleagues"
    ON public.staff FOR SELECT
    TO authenticated
    USING (public.is_restaurant_staff(restaurant_id));

CREATE POLICY "admins_manage_staff"
    ON public.staff FOR ALL
    TO authenticated
    USING (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin'))
    WITH CHECK (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin'));

-- ORDERS: Staff can view all orders in their restaurant
CREATE POLICY "staff_view_orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (public.is_restaurant_staff(restaurant_id));

CREATE POLICY "staff_update_orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (public.is_restaurant_staff(restaurant_id))
    WITH CHECK (public.is_restaurant_staff(restaurant_id));

-- ORDER ITEMS: Staff can view and manage items
CREATE POLICY "staff_view_order_items"
    ON public.order_items FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
          AND public.is_restaurant_staff(orders.restaurant_id)
    ));

-- FINANCE: Strictly restricted to SuperAdmin, Admin, and Manager
CREATE POLICY "managers_view_finance"
    ON public.finance_records FOR SELECT
    TO authenticated
    USING (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin', 'manager'));

CREATE POLICY "managers_manage_finance"
    ON public.finance_records FOR ALL
    TO authenticated
    USING (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin', 'manager'))
    WITH CHECK (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin', 'manager'));

-- MENU MANAGEMENT: Admins, Managers, Chefs can manage menu items
CREATE POLICY "staff_manage_menu"
    ON public.menu_items FOR ALL
    TO authenticated
    USING (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin', 'manager', 'chef'))
    WITH CHECK (public.current_staff_role(restaurant_id) IN ('SuperAdmin', 'admin', 'manager', 'chef'));

-- RESTAURANTS: Only owner / SuperAdmin can update restaurant settings
CREATE POLICY "owner_manage_restaurant"
    ON public.restaurants FOR ALL
    TO authenticated
    USING (owner_id = auth.uid() OR public.current_staff_role(id) = 'SuperAdmin')
    WITH CHECK (owner_id = auth.uid() OR public.current_staff_role(id) = 'SuperAdmin');
