ALTER TABLE t_p51841735_bracelet_store_creat.cart_orders
  ADD COLUMN IF NOT EXISTS payment_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
