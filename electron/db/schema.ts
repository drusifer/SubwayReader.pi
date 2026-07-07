export const SCHEMA = `
CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  login_url TEXT,
  selector_config JSON
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  author TEXT,
  published_at DATETIME,
  crawled_at DATETIME,
  local_path TEXT,
  is_read BOOLEAN DEFAULT 0,
  is_paywalled BOOLEAN,
  FOREIGN KEY(source_id) REFERENCES sources(id)
);
`;
