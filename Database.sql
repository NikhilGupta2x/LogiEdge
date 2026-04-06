
-- LogiEdge Billing Dashboard - Database Script

CREATE TABLE customers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  address    TEXT,
  pan_number VARCHAR(10),
  gstin      VARCHAR(15),
  status     VARCHAR(10) DEFAULT 'Active'
);

CREATE TABLE items (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  status     VARCHAR(10) DEFAULT 'Active'
);

CREATE TABLE invoices (
  id          SERIAL PRIMARY KEY,
  invoice_id  VARCHAR(10) UNIQUE NOT NULL,
  customer_id INT NOT NULL REFERENCES customers(id),
  subtotal    DECIMAL(10, 2) NOT NULL,
  gst_amount  DECIMAL(10, 2) NOT NULL,
  total       DECIMAL(10, 2) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id         SERIAL PRIMARY KEY,
  invoice_id VARCHAR(10) NOT NULL REFERENCES invoices(invoice_id),
  item_id    INT NOT NULL REFERENCES items(id),
  quantity   INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);