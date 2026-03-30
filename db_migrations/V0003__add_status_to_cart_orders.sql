ALTER TABLE t_p51841735_bracelet_store_creat.cart_orders
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new',
ADD COLUMN IF NOT EXISTS tg_message_id BIGINT;