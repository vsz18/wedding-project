-- Timeline events (day-of schedule)
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
  person      TEXT        NOT NULL DEFAULT 'bride',   -- bride | groom | bridesmaids
  section     TEXT        NOT NULL DEFAULT 'ceremony', -- bridal_suite | ceremony | reception
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
