-- Makeup schedule (two concurrent chairs / artists)
CREATE TABLE IF NOT EXISTS makeup_schedule (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'bridesmaid',
  start_time  TIME        NOT NULL,
  end_time    TIME        NOT NULL,
  artist_chair INT        NOT NULL DEFAULT 1,  -- 1 or 2 (two parallel chairs)
  notes       TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER makeup_schedule_updated_at
  BEFORE UPDATE ON makeup_schedule
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Bridesmaids tasks (separate from main wedding tasks)
CREATE TABLE IF NOT EXISTS bridesmaids_tasks (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  assignee    TEXT        NOT NULL DEFAULT 'all',  -- 'all' or a bridesmaid's name
  completed   BOOLEAN     NOT NULL DEFAULT false,
  due_day     INT,                                  -- days before wedding
  due_time    TEXT,                                 -- day-of clock time, e.g. "1:00 PM"
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER bridesmaids_tasks_updated_at
  BEFORE UPDATE ON bridesmaids_tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
