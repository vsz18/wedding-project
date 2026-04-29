-- Sample tasks for development
INSERT INTO tasks (title, category, due_day) VALUES
  ('Confirm final headcount with venue', 'venue',    30),
  ('Send final menu choices to caterer', 'catering', 28),
  ('Arrange transportation for wedding party', 'logistics', 21),
  ('Confirm ceremony music with DJ', 'entertainment', 14),
  ('Pick up wedding dress / suit', 'attire',       7),
  ('Prepare vendor payments & envelopes', 'finance', 5),
  ('Pack honeymoon bags', 'personal',               2),
  ('Rehearsal dinner confirmation', 'events',       1)
ON CONFLICT DO NOTHING;
