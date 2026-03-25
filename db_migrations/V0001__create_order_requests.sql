CREATE TABLE IF NOT EXISTS t_p51841735_bracelet_store_creat.order_requests (
  id SERIAL PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date TEXT,
  request_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);