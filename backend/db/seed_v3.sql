-- ============================================================
-- MAKEUP SCHEDULE  (Glamsquad @ Faculty House, 30 May 2026)
-- Two artists working simultaneously.
-- Chair 1: Brianna C  |  Chair 2: Fjorela P
-- ============================================================
INSERT INTO makeup_schedule (name, role, start_time, end_time, artist_chair, sort_order) VALUES
  ('Ashley Reed',      'bridesmaid', '08:15', '09:15', 1, 10),
  ('Anyssa Chebbi',    'bridesmaid', '09:45', '10:45', 2, 20),
  ('Margaret Li',      'bridesmaid', '09:15', '10:15', 1, 30),
  ('Ayushi Sinha',     'bridesmaid', '10:45', '11:45', 2, 40),
  ('Katherine Herbout','moh',        '10:15', '11:15', 1, 50),
  ('Valerie Wilson',   'bridesmaid', '11:45', '12:45', 2, 60),
  ('Victoria Scott',   'bride',      '11:15', '12:45', 1, 70)
ON CONFLICT DO NOTHING;

-- ============================================================
-- BRIDESMAIDS TASKS
-- ============================================================
INSERT INTO bridesmaids_tasks (title, assignee, due_day, due_time) VALUES
  -- Pre-wedding (due_day = days before wedding)
  ('Confirm dress alterations are complete',        'all',              14,  NULL),
  ('Pick up bridesmaid dress',                      'all',              7,   NULL),
  ('Buy or confirm shoes match dress',              'all',              7,   NULL),
  ('Confirm transportation to Faculty House',       'all',              3,   NULL),
  ('Review day-of timeline and share ETAs',         'all',              1,   NULL),
  ('Prepare speech (MOH)',                          'Katherine Herbout',7,   NULL),
  ('Coordinate bachelorette details',               'Katherine Herbout',30,  NULL),
  -- Day-of tasks (due_time = clock time)
  ('Arrive at Faculty House',                       'all',              NULL,'8:00 AM'),
  ('Complete makeup and hair',                      'all',              NULL,'12:30 PM'),
  ('Be fully dressed',                              'all',              NULL,'1:00 PM'),
  ('Depart for Riverside Church',                   'all',              NULL,'1:40 PM'),
  ('Hold bouquet for ceremony',                     'all',              NULL,'2:05 PM'),
  ('Hold Victoria''s touch-up bag during ceremony', 'Katherine Herbout',NULL,'2:05 PM'),
  ('Family + bridal party photos at Riverside',     'all',              NULL,'2:45 PM'),
  ('Bridesmaids group shots – cocktail hour',       'all',              NULL,'4:00 PM'),
  ('MOH speech during dinner',                      'Katherine Herbout',NULL,'6:20 PM'),
  ('Bouquet toss participation',                    'all',              NULL,'7:40 PM')
ON CONFLICT DO NOTHING;
