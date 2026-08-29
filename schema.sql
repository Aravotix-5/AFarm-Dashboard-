CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  unit TEXT,
  available INTEGER
);

CREATE TABLE IF NOT EXISTS customers (
  key TEXT PRIMARY KEY,
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  google_sub TEXT DEFAULT '',
  points INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_key TEXT NOT NULL,
  items_summary TEXT NOT NULL,
  total REAL NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Order Received',
  created_at TEXT NOT NULL
);
