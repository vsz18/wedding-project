-- Production schema — run once against a fresh database
-- Combines schema.sql + schema_v2.sql + schema_v3.sql + migration_v1

-- Shared updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tasks (includes sort_order from migration_v1)
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL DEFAULT 'general',
  due_day     INT,
  completed   BOOLEAN     NOT NULL DEFAULT false,
  notes       TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Timeline events
CREATE TABLE IF NOT EXISTS timeline_events (
  id            SERIAL PRIMARY KEY,
  title         TEXT        NOT NULL,
  start_time    TIME        NOT NULL,
  duration_mins INT         NOT NULL DEFAULT 30,
  buffer_mins   INT         NOT NULL DEFAULT 0,
  location      TEXT,
  category      TEXT        NOT NULL DEFAULT 'general',
  delay_mins    INT         NOT NULL DEFAULT 0,
  notes         TEXT,
  sort_order    INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Packing list items
CREATE TABLE IF NOT EXISTS packing_items (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  person      TEXT        NOT NULL DEFAULT 'bride',
  section     TEXT        NOT NULL DEFAULT 'ceremony',
  packed      BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER packing_items_updated_at
  BEFORE UPDATE ON packing_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
  id            SERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  company       TEXT,
  phone         TEXT,
  email         TEXT,
  arrival_time  TIME,
  location      TEXT,
  category      TEXT        NOT NULL DEFAULT 'other',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Makeup schedule
CREATE TABLE IF NOT EXISTS makeup_schedule (
  id            SERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'bridesmaid',
  start_time    TIME        NOT NULL,
  end_time      TIME        NOT NULL,
  artist_chair  INT         NOT NULL DEFAULT 1,
  notes         TEXT,
  sort_order    INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER makeup_schedule_updated_at
  BEFORE UPDATE ON makeup_schedule
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Bridesmaids tasks
CREATE TABLE IF NOT EXISTS bridesmaids_tasks (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  assignee    TEXT        NOT NULL DEFAULT 'all',
  completed   BOOLEAN     NOT NULL DEFAULT false,
  due_day     INT,
  due_time    TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER bridesmaids_tasks_updated_at
  BEFORE UPDATE ON bridesmaids_tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
