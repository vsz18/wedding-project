-- Production seed: combines all seed files
-- Safe to run on empty tables (ON CONFLICT DO NOTHING)

-- Tasks
INSERT INTO tasks (title, category, due_day) VALUES
  ('Confirm final headcount with venue',        'venue',          30),
  ('Send final menu choices to caterer',         'catering',       28),
  ('Arrange transportation for wedding party',   'logistics',      21),
  ('Confirm ceremony music with DJ',             'entertainment',  14),
  ('Pick up wedding dress / suit',               'attire',          7),
  ('Prepare vendor payments & envelopes',        'finance',         5),
  ('Pack honeymoon bags',                        'personal',        2),
  ('Rehearsal dinner confirmation',              'events',          1)
ON CONFLICT DO NOTHING;
-- ============================================================
-- TIMELINE EVENTS  (Scott-Zhang Wedding, 30 May 2026)
-- buffer_mins = slack before next dependent event starts
-- ============================================================
INSERT INTO timeline_events (title, start_time, duration_mins, buffer_mins, location, category, sort_order) VALUES
  ('Bride + Bridesmaids arrive',            '08:00', 15,  10, 'Faculty House',      'getting_ready', 10),
  ('Makeup begins – Glamsquad',             '08:15', 255,  0, 'Faculty House',      'getting_ready', 20),
  ('Florals arrive – Riverside Church',     '10:00', 30,   0, 'Riverside Church',   'vendor_arrival', 30),
  ('Florals arrive – Faculty House',        '10:30', 60,   0, 'Faculty House',      'vendor_arrival', 40),
  ('Photographer (Margaret) arrives',       '11:30', 30,   0, 'Faculty House',      'vendor_arrival', 50),
  ('Details photos',                        '12:00', 30,  10, 'Faculty House',      'photos',         60),
  ('Scott family arrives + lunch',          '12:00', 30,   0, 'Faculty House',      'getting_ready',  65),
  ('Makeup complete',                       '12:30', 0,   20, 'Faculty House',      'getting_ready',  70),
  ('"Getting Ready" bridesmaids photos',    '12:50', 10,   0, 'Faculty House',      'photos',         80),
  ('Bridesmaids dressed',                   '13:00', 15,   0, 'Faculty House',      'getting_ready',  90),
  ('Gilmors arrive Riverside – check flowers','13:00',15,  0, 'Riverside Church',   'vendor_arrival', 95),
  ('Victoria dressed',                      '13:15', 25,  15, 'Faculty House',      'getting_ready', 100),
  ('Bridal party departs for Riverside',    '13:40', 25,  10, 'Faculty House → Riverside', 'travel', 110),
  ('Ceremony',                              '14:05', 55,  10, 'Riverside Church',   'ceremony',      120),
  ('Family + Bridesmaids photos at Riverside','14:45',45, 10, 'Riverside Church',   'photos',        130),
  ('String Trio arrives Columbia',          '15:00', 0,    0, 'Faculty House',      'vendor_arrival', 140),
  ('String Trio begins playing',            '15:30', 90,   0, 'Faculty House – Skyline', 'ceremony', 145),
  ('DJ Joel arrives',                       '15:45', 0,    0, 'Faculty House',      'vendor_arrival', 150),
  ('Cocktail hour begins',                  '15:45', 45,   0, 'Faculty House – Skyline', 'reception', 155),
  ('Family departs Riverside → Faculty House','15:50',10,  5, 'Riverside → Faculty House', 'travel', 160),
  ('Victoria + Alan campus photos + group shots','16:00',30, 10, 'Columbia Campus', 'photos',        170),
  ('Victoria + Alan arrive cocktail hour',  '16:30', 20,   0, 'Faculty House – Skyline', 'reception', 180),
  ('Guests find seats (move to Ballroom)',  '16:50', 15,   0, 'Presidential Ballroom', 'reception',  190),
  ('Mr. + Mrs. Zhang introduction',         '17:05', 5,    0, 'Presidential Ballroom', 'reception',  200),
  ('First Dance',                           '17:05', 5,    0, 'Presidential Ballroom', 'reception',  210),
  ('Open dancing – 2 songs',                '17:10', 10,   0, 'Presidential Ballroom', 'reception',  220),
  ('Welcome toast (Ted Scott)',             '17:20', 5,    0, 'Presidential Ballroom', 'reception',  230),
  ('Appetizers served',                     '17:20', 40,   0, 'Presidential Ballroom', 'reception',  240),
  ('Main course served',                    '18:00', 20,   0, 'Presidential Ballroom', 'reception',  250),
  ('Speeches',                              '18:20', 25,  10, 'Presidential Ballroom', 'reception',  260),
  ('Special dances (Mother/Son + Father/Daughter)','18:45',10,0,'Presidential Ballroom','reception', 270),
  ('Table photos (8 tables)',               '19:00', 40,  10, 'Presidential Ballroom', 'photos',     280),
  ('Bouquet toss',                          '19:40', 5,    0, 'Presidential Ballroom', 'reception',  290),
  ('Cake cutting',                          '19:45', 5,    5, 'Presidential Ballroom', 'reception',  300),
  ('Dance floor opens + dessert served',    '19:50', 130,  0, 'Presidential Ballroom', 'reception',  310),
  ('Reception ends',                        '22:00', 0,    0, 'Faculty House',      'reception',     320)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PACKING LIST  (pre-seeded; editable in app)
-- ============================================================

-- BRIDE
INSERT INTO packing_items (title, person, section) VALUES
  -- Bridal Suite
  ('Wedding dress',            'bride', 'bridal_suite'),
  ('Overskirt',                'bride', 'bridal_suite'),
  ('Bridal shoes',             'bride', 'bridal_suite'),
  ('Jewelry (earrings, necklace, bracelet)', 'bride', 'bridal_suite'),
  ('Veil',                     'bride', 'bridal_suite'),
  ('Lip oil / touch-up makeup','bride', 'bridal_suite'),
  ('Phone + charger',          'bride', 'bridal_suite'),
  ('Wet wipes',                'bride', 'bridal_suite'),
  ('First aid kit',            'bride', 'bridal_suite'),
  ('Safety pins + fashion tape','bride','bridal_suite'),
  ('Snacks + water',           'bride', 'bridal_suite'),
  ('Emergency sewing kit',     'bride', 'bridal_suite'),
  -- Ceremony
  ('Rings (keep with MOH)',     'bride', 'ceremony'),
  ('Vows / vow card',           'bride', 'ceremony'),
  ('Handkerchief / tissues',    'bride', 'ceremony'),
  ('Touch-up bag for bag hand-off','bride','ceremony'),
  -- Reception
  ('Change of shoes (optional)','bride', 'reception'),
  ('Phone charger',             'bride', 'reception'),
  ('Lip gloss / touch-up',      'bride', 'reception'),
  ('Personal items for end of night','bride','reception')

ON CONFLICT DO NOTHING;

-- GROOM
INSERT INTO packing_items (title, person, section) VALUES
  -- Bridal Suite (prep area)
  ('Suit / tuxedo',            'groom', 'bridal_suite'),
  ('Dress shirt',              'groom', 'bridal_suite'),
  ('Tie or bow tie',           'groom', 'bridal_suite'),
  ('Dress shoes + socks',      'groom', 'bridal_suite'),
  ('Cufflinks',                'groom', 'bridal_suite'),
  ('Boutonnière (pick up from florist)','groom','bridal_suite'),
  ('Phone + charger',          'groom', 'bridal_suite'),
  ('Grooming kit (razor, cologne)','groom','bridal_suite'),
  -- Ceremony
  ('Rings (hand to best man)',  'groom', 'ceremony'),
  ('Vows / vow card',           'groom', 'ceremony'),
  ('Handkerchief',              'groom', 'ceremony'),
  -- Reception
  ('Phone charger',             'groom', 'reception'),
  ('Comfortable shoes for dancing','groom','reception'),
  ('Speech note card (if needed)','groom','reception')

ON CONFLICT DO NOTHING;

-- BRIDESMAIDS
INSERT INTO packing_items (title, person, section) VALUES
  -- Bridal Suite
  ('Bridesmaid dress',          'bridesmaids', 'bridal_suite'),
  ('Shoes',                     'bridesmaids', 'bridal_suite'),
  ('Jewelry (provided or own)', 'bridesmaids', 'bridal_suite'),
  ('Hair accessories',          'bridesmaids', 'bridal_suite'),
  ('Phone + charger',           'bridesmaids', 'bridal_suite'),
  ('Snacks for getting ready',  'bridesmaids', 'bridal_suite'),
  ('Touch-up makeup',           'bridesmaids', 'bridal_suite'),
  ('Safety pins + fashion tape','bridesmaids', 'bridal_suite'),
  -- Ceremony
  ('Bouquet (assigned by florist)','bridesmaids','ceremony'),
  ('Tissues',                    'bridesmaids', 'ceremony'),
  ('Bride''s touch-up bag (MOH holds)','bridesmaids','ceremony'),
  -- Reception
  ('Phone charger',              'bridesmaids', 'reception'),
  ('Comfortable shoes for dancing','bridesmaids','reception'),
  ('Speech notes (MOH / speakers)', 'bridesmaids','reception')

ON CONFLICT DO NOTHING;

-- ============================================================
-- VENDORS  (from Schedule.docx)
-- ============================================================
INSERT INTO vendors (name, company, phone, email, arrival_time, location, category, notes) VALUES
  ('Mr. Clent Paddio Jones', 'Riverside Church',            '917-231-6833', 'cjones@trcnyc.org',              '12:00', 'Riverside Church',        'ceremony_venue',  'Ceremony venue contact. Address: 490 Riverside Drive'),
  ('Diana Cena',             'Columbia University Faculty House','646-965-2683','dc3368@columbia.edu',         '08:00', 'Faculty House',           'reception_venue', 'Reception venue contact. Address: 64 Morningside Drive'),
  ('Joel Ortsman',           'Beat Train Productions',      '631-786-3070', 'JoelOrtsman@BeatTrainNYC.com',   '15:45', 'Faculty House',           'dj',              'DJ for reception. Playing from cocktail hour through end of night.'),
  ('Margaret Anozil',        'Margaret K Photography',      '732-841-5365', 'shotbymargaretk@gmail.com',      '11:30', 'Faculty House',           'photography',     'Arrives Faculty House 11:30 AM for details + getting-ready shots.'),
  ('Candy Yang',             'Trio Lumaire',                '929-300-8184', 'triolumaire@gmail.com',          '15:00', 'Faculty House',           'music',           'String trio. Arrives 3:00 PM, plays 3:30–5:00 PM at Skyline Level.'),
  ('Steve',                  'Superior Florist',            '212-679-4065', 'steve@superiorflorist.com',      '10:00', 'Riverside Church + Faculty House', 'florals', 'Ceremony flowers to Riverside 10:00 AM; reception + personal flowers to Faculty House 10:30 AM.'),
  ('Briana C / Fjorela P',   'GlamSquad',                  '973-632-1984', 'weddings@glamsquad.com',         '08:15', 'Faculty House',           'beauty',          'Makeup for 7 people. Schedule: Ashley 8:15, Margaret 9:15, Katherine 10:15, Victoria 11:15. Anyssa 9:45, Ayushi 10:45, Valerie 11:45.')
ON CONFLICT DO NOTHING;
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
-- Groomsmen packing list
INSERT INTO packing_items (title, person, section) VALUES
  -- Getting Ready
  ('Suits / tuxedos (pressed)',      'groomsmen', 'bridal_suite'),
  ('Dress shirts',                   'groomsmen', 'bridal_suite'),
  ('Ties / bow ties',                'groomsmen', 'bridal_suite'),
  ('Pocket squares',                 'groomsmen', 'bridal_suite'),
  ('Cufflinks',                      'groomsmen', 'bridal_suite'),
  ('Dress socks',                    'groomsmen', 'bridal_suite'),
  ('Dress shoes (polished)',         'groomsmen', 'bridal_suite'),
  ('Cologne',                        'groomsmen', 'bridal_suite'),
  ('Grooming kit (razor, haircare)', 'groomsmen', 'bridal_suite'),
  ('Deodorant',                      'groomsmen', 'bridal_suite'),
  ('Phone + charger',                'groomsmen', 'bridal_suite'),
  -- Ceremony
  ('Boutonnières',                   'groomsmen', 'ceremony'),
  ('Wedding rings (best man)',       'groomsmen', 'ceremony'),
  ('Vows / notes (if applicable)',   'groomsmen', 'ceremony'),
  ('Sunglasses (outdoor ceremony)',  'groomsmen', 'ceremony'),
  -- Reception
  ('Speech notes',                   'groomsmen', 'reception'),
  ('Extra cash / card',              'groomsmen', 'reception'),
  ('Change of shoes (optional)',     'groomsmen', 'reception');
