CREATE TABLE IF NOT EXISTS t_p51841735_bracelet_store_creat.cart_orders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  comment TEXT,
  items JSONB NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);