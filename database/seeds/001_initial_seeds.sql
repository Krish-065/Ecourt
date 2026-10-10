-- =========================================================================
-- ECourt AI Legal Operating System - Comprehensive Interconnected Seed Data
-- Location: database/seeds/001_initial_seeds.sql
-- Default test credentials for all accounts: Password123!
-- =========================================================================

-- Verified bcrypt hash for 'Password123!'
-- $2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O

-- -------------------------------------------------------------------------
-- 1. SEED USERS FOR ALL ROLES (5 to 7 accounts per role)
-- -------------------------------------------------------------------------

-- 1.1 ADVOCATES (6 Advocates)
INSERT INTO users (id, full_name, email, password_hash, role, phone_number, verification_status, bar_council_id, college_id, company_registration_no)
VALUES 
('22222222-2222-2222-2222-222222222222', 'Adv. Rajeshwar Sharma', 'advocate@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADVOCATE', '+91 98110 44219', 'VERIFIED', 'D/1420/2006', NULL, NULL),
('22222222-2222-2222-2222-222222222223', 'Adv. Meera Deshmukh', 'meera.deshmukh@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADVOCATE', '+91 98201 55321', 'VERIFIED', 'MAH/3312/2012', NULL, NULL),
('22222222-2222-2222-2222-222222222224', 'Adv. Anand K. Sen', 'anand.sen@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADVOCATE', '+91 98305 77123', 'VERIFIED', 'WB/0842/2009', NULL, NULL),
('22222222-2222-2222-2222-222222222225', 'Adv. Rohit Singhania', 'rohit.singhania@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADVOCATE', '+91 98791 22441', 'VERIFIED', 'GUJ/1190/2015', NULL, NULL),
('22222222-2222-2222-2222-222222222226', 'Adv. Kavita Rao', 'kavita.rao@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADVOCATE', '+91 98450 66782', 'VERIFIED', 'KAR/2451/2014', NULL, NULL),
('22222222-2222-2222-2222-222222222227', 'Adv. Arvind Swaminathan', 'arvind.swami@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADVOCATE', '+91 98412 88990', 'VERIFIED', 'TN/0912/2010', NULL, NULL)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  verification_status = 'VERIFIED',
  bar_council_id = EXCLUDED.bar_council_id;

-- 1.2 CITIZENS (6 Citizens)
INSERT INTO users (id, full_name, email, password_hash, role, phone_number, verification_status, bar_council_id, college_id, company_registration_no)
VALUES 
('33333333-3333-3333-3333-333333333333', 'Priya Verma', 'citizen@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'CITIZEN', '+91 98765 43212', 'VERIFIED', NULL, NULL, NULL),
('33333333-3333-3333-3333-333333333334', 'Rahul Sharma', 'rahul.sharma@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'CITIZEN', '+91 98101 23456', 'VERIFIED', NULL, NULL, NULL),
('33333333-3333-3333-3333-333333333335', 'Sunita Devi', 'sunita.devi@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'CITIZEN', '+91 98234 56789', 'VERIFIED', NULL, NULL, NULL),
('33333333-3333-3333-3333-333333333336', 'Vikram Malhotra', 'vikram.malhotra@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'CITIZEN', '+91 98980 12345', 'VERIFIED', NULL, NULL, NULL),
('33333333-3333-3333-3333-333333333337', 'Ananya Sen', 'ananya.sen@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'CITIZEN', '+91 98311 98765', 'VERIFIED', NULL, NULL, NULL),
('33333333-3333-3333-3333-333333333338', 'Harpreet Singh', 'harpreet.singh@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'CITIZEN', '+91 98140 11223', 'VERIFIED', NULL, NULL, NULL)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  verification_status = 'VERIFIED';

-- 1.3 BUSINESS ENTITIES (5 Corporate Accounts)
INSERT INTO users (id, full_name, email, password_hash, role, phone_number, verification_status, bar_council_id, college_id, company_registration_no)
VALUES 
('55555555-5555-5555-5555-555555555555', 'Nexus Retail Pvt Ltd', 'business@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'BUSINESS', '+91 22 2845 9000', 'VERIFIED', NULL, NULL, 'U72200MH2021PTC123456'),
('55555555-5555-5555-5555-555555555556', 'Tata Tech Solutions Ltd', 'corporate@tatatech.ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'BUSINESS', '+91 80 4123 4567', 'VERIFIED', NULL, NULL, 'U72900KA2018PLC098765'),
('55555555-5555-5555-5555-555555555557', 'BlueSky Logistics Ltd', 'compliance@bluesky.ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'BUSINESS', '+91 33 2289 1122', 'VERIFIED', NULL, NULL, 'U63090WB2019PLC112233'),
('55555555-5555-5555-5555-555555555558', 'Apex Pharma Health Care', 'legal@apexpharma.ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'BUSINESS', '+91 79 4001 2233', 'VERIFIED', NULL, NULL, 'U24230GJ2020PTC045678'),
('55555555-5555-5555-5555-555555555559', 'GreenEnergy Infra Corp', 'regulatory@greenenergy.ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'BUSINESS', '+91 11 4321 8899', 'VERIFIED', NULL, NULL, 'U40100DL2022PLC087654')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  verification_status = 'VERIFIED',
  company_registration_no = EXCLUDED.company_registration_no;

-- 1.4 LAW STUDENTS (5 Students)
INSERT INTO users (id, full_name, email, password_hash, role, phone_number, verification_status, bar_council_id, college_id, company_registration_no)
VALUES 
('44444444-4444-4444-4444-444444444444', 'Aarav Patel', 'student@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'LAW_STUDENT', '+91 98765 43213', 'VERIFIED', NULL, 'NLSIU-2024-089', NULL),
('44444444-4444-4444-4444-444444444445', 'Sneha Kulkarni', 'sneha.kulkarni@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'LAW_STUDENT', '+91 98200 11445', 'VERIFIED', NULL, 'GLC-MUM-2023-142', NULL),
('44444444-4444-4444-4444-444444444446', 'Devansh Singhania', 'devansh.s@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'LAW_STUDENT', '+91 98112 33445', 'VERIFIED', NULL, 'NLU-DEL-2024-055', NULL),
('44444444-4444-4444-4444-444444444447', 'Riya Mukherjee', 'riya.m@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'LAW_STUDENT', '+91 98300 55667', 'VERIFIED', NULL, 'NUJS-KOL-2023-210', NULL),
('44444444-4444-4444-4444-444444444448', 'Tanmay Joshi', 'tanmay.joshi@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'LAW_STUDENT', '+91 98450 77889', 'VERIFIED', NULL, 'NALSAR-HYD-2024-118', NULL)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  verification_status = 'VERIFIED',
  college_id = EXCLUDED.college_id;

-- 1.5 ADMINS (3 System Admins)
INSERT INTO users (id, full_name, email, password_hash, role, phone_number, verification_status, bar_council_id, college_id, company_registration_no)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Registrar General Delhi HC', 'admin@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADMIN', '+91 11 2338 1234', 'VERIFIED', NULL, NULL, NULL),
('11111111-1111-1111-1111-111111111112', 'Judicial Master Bench 4', 'benchmaster@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADMIN', '+91 11 2338 5678', 'VERIFIED', NULL, NULL, NULL),
('11111111-1111-1111-1111-111111111113', 'eCourt IT Audit Officer', 'audit@ecourt.in', '$2b$10$RZ6FPY8eAaRuXIz5hlgs0OHn9ugfD4Q0GOSqDkGRG5fRXmOnzJH2O', 'ADMIN', '+91 11 2338 9900', 'VERIFIED', NULL, NULL, NULL)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  verification_status = 'VERIFIED';

-- -------------------------------------------------------------------------
-- 2. SEED ADVOCATE DIRECTORY PROFILES
-- -------------------------------------------------------------------------
INSERT INTO advocate_profiles (user_id, full_name, specialization, office_location, experience_years, contact_phone, bio)
VALUES
('22222222-2222-2222-2222-222222222222', 'Adv. Rajeshwar Sharma', 'Constitutional & Criminal Law', 'New Delhi (Supreme Court Chambers)', 18, '+91 98110 44219', 'Senior practitioner representing clients before the Supreme Court of India and High Court of Delhi in writ petitions, BNS criminal appeals, and constitutional challenges.'),
('22222222-2222-2222-2222-222222222223', 'Adv. Meera Deshmukh', 'Property & Consumer Disputes', 'Mumbai, Maharashtra (Fort Chambers)', 14, '+91 98201 55321', 'Leading specialist in real estate RERA litigations, civil boundary disputes under CPC, and consumer redressal claims before State and National Commissions.'),
('22222222-2222-2222-2222-222222222224', 'Adv. Anand K. Sen', 'Corporate Arbitration & Commercial Recovery', 'Kolkata, West Bengal (High Court)', 15, '+91 98305 77123', 'Extensive track record handling Section 138 NI Act cheque dishonour suits, Section 9 interim measures, and international commercial arbitrations.'),
('22222222-2222-2222-2222-222222222225', 'Adv. Rohit Singhania', 'Criminal Defense & Anticipatory Bail', 'Ahmedabad, Gujarat (High Court Road)', 11, '+91 98791 22441', 'Specialist in BNSS Section 482 anticipatory bail motions, white-collar financial fraud under BNS 318, and cyber-crime forensic defense.'),
('22222222-2222-2222-2222-222222222226', 'Adv. Kavita Rao', 'IP, Tech & Commercial Contracts', 'Bengaluru, Karnataka (MG Road Chambers)', 13, '+91 98450 66782', 'Advises technology unicorns and corporate leaders on patent disputes, trade secrets, software master contracts, and DPDP Act statutory compliance.'),
('22222222-2222-2222-2222-222222222227', 'Adv. Arvind Swaminathan', 'Labour, Industrial & Environmental Law', 'Chennai, Tamil Nadu (Madras HC)', 16, '+91 98412 88990', 'Practicing across NGT, Madras High Court, and Industrial Tribunals regarding corporate environmental compliance and employment disputes.')
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  specialization = EXCLUDED.specialization,
  office_location = EXCLUDED.office_location,
  experience_years = EXCLUDED.experience_years,
  contact_phone = EXCLUDED.contact_phone,
  bio = EXCLUDED.bio;

-- -------------------------------------------------------------------------
-- 3. SEED 7 INTERCONNECTED CASES (Linking Clients to Advocates)
-- -------------------------------------------------------------------------

-- Note: Case 1 dynamically binds to Meet Thacker if he has an account, or Priya Verma
INSERT INTO cases (id, case_number, title, description, court_name, statute_section, status, priority, client_id, advocate_id, filing_date)
VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'EC-DEL-2026-0042', 'Meet Thacker vs. State of NCT Delhi & Anr.', 'Contested municipal boundary demarcation and unauthorized commercial encroachment claim under Bharatiya Nagarik Suraksha Sanhita.', 'High Court of Delhi (Civil Bench 4)', 'BNS Sec 329 / BNSS Sec 144', 'UNDER_TRIAL', 'HIGH', 
 (SELECT COALESCE((SELECT id FROM users WHERE email IN ('meetthacker816@gmail.com', 'citizen@ecourt.com', 'abc@gmail.com') LIMIT 1), '33333333-3333-3333-3333-333333333333'::uuid)), 
 '22222222-2222-2222-2222-222222222222', '2026-01-15'),

('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'EC-BOM-2026-1189', 'Nexus Retail Pvt Ltd vs. Municipal Corporation of Greater Mumbai', 'Writ Petition under Article 226 challenging property assessment re-evaluation and municipal commercial license cancellation notice.', 'Bombay High Court (Original Side)', 'Art. 226 Constitution / Commercial Courts Act Sec 12A', 'PENDING_HEARING', 'CRITICAL', 
 '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '2026-02-10'),

('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'EC-DEL-2026-3391', 'Priya Verma vs. ABC Luxury Realtors Ltd', 'Deficiency of service, unfair trade practice, and delayed flat possession interest recovery claim under Consumer Protection Act.', 'Delhi State Consumer Disputes Redressal Commission', 'Consumer Protection Act Sec 35 / RERA Sec 18', 'UNDER_TRIAL', 'HIGH', 
 '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222223', '2026-02-22'),

('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'EC-SC-2026-0774', 'Rahul Sharma & Ors. vs. Union of India', 'Constitutional Public Interest Litigation (PIL) under Article 32 testing digital privacy and lawful data surveillance guidelines.', 'Supreme Court of India (Constitutional Bench)', 'Article 21 & 32 Constitution / DPDP Act 2023', 'UNDER_TRIAL', 'CRITICAL', 
 '33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222222', '2026-03-01'),

('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'EC-KAR-2026-5520', 'Tata Tech Solutions Ltd vs. Global Cloud Vendor Inc.', 'Commercial arbitration petition seeking interim injunction under Section 9 against wrongful software service termination.', 'High Court of Karnataka (Commercial Division)', 'Arbitration and Conciliation Act Sec 9 / IT Act Sec 43A', 'PENDING_HEARING', 'HIGH', 
 '55555555-5555-5555-5555-555555555556', '22222222-2222-2222-2222-222222222226', '2026-03-12'),

('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'EC-AHM-2026-2418', 'Vikram Malhotra vs. State of Gujarat & Anr.', 'Anticipatory bail petition under BNSS Section 482 arising out of business partnership financial disagreement.', 'City Civil and Sessions Court, Ahmedabad', 'BNSS Section 482 / BNS Section 318(4) Cheating', 'FILED', 'MEDIUM', 
 '33333333-3333-3333-3333-333333333336', '22222222-2222-2222-2222-222222222225', '2026-03-18'),

('07a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c', 'EC-CAL-2026-9041', 'BlueSky Logistics Ltd vs. Eastern Steels Corp', 'Commercial recovery summary suit under Order 37 CPC and Section 138 Negotiable Instruments Act for dishonoured cargo freight payments.', 'Calcutta High Court (Commercial Bench)', 'NI Act Sec 138 / Order 37 CPC', 'UNDER_TRIAL', 'MEDIUM', 
 '55555555-5555-5555-5555-555555555557', '22222222-2222-2222-2222-222222222224', '2026-03-25')
ON CONFLICT (case_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  court_name = EXCLUDED.court_name,
  statute_section = EXCLUDED.statute_section,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority,
  client_id = EXCLUDED.client_id,
  advocate_id = EXCLUDED.advocate_id;

-- -------------------------------------------------------------------------
-- 4. SEED HEARINGS FOR INTERCONNECTED CASES
-- -------------------------------------------------------------------------
INSERT INTO hearings (case_id, hearing_date, purpose, judge_name, outcome_notes, next_steps)
VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2026-08-18 10:30:00+05:30', 'Arguments on Demarcation Survey & Interim Status Quo Injunction', 'Hon''ble Justice Vipin Sanghi', 'Advocate Rajeshwar Sharma argued on irreparable injury. Awaiting counter-affidavit by municipal surveyor.', 'Survey report filing within 7 days. Rejoinder on record.'),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2026-09-02 14:00:00+05:30', 'Hearing on Stay against Municipal Commercial License Revocation', 'Hon''ble Justice G. S. Patel', 'Interim protection extended until next date. Corporation directed not to take coercive steps.', 'Corporation counsel to file formal reply affidavit.'),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2026-08-25 11:15:00+05:30', 'Final Evidence & Cross-examination of Builder Engineering Representative', 'Hon''ble President Justice Deepa Sharma', 'Complainant Priya Verma cross-examined builder representative through Adv. Meera Deshmukh.', 'Final arguments listed on compliance of RERA possession clauses.'),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2026-09-15 10:30:00+05:30', 'Constitutional Bench Preliminary Framing of Questions on Data Privacy', 'Hon''ble Chief Justice of India', 'Petitioners led by Adv. Rajeshwar Sharma submitted 5 core questions on digital privacy under Article 21.', 'Attorney General for India granted 3 weeks to respond on technical safeguards.'),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2026-09-08 14:30:00+05:30', 'Section 9 Interim Measure Hearing on Software IP Source Code Custody', 'Hon''ble Justice B. Veerappa', 'Respondent agreed in principle not to wipe remote database instances until arbitration panel is constituted.', 'Parties to agree on sole arbitrator within 10 days.')
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------------
-- 5. SEED EVIDENCE TIMELINE RECORDS
-- -------------------------------------------------------------------------
INSERT INTO evidence (case_id, title, description, evidence_type, source_origin, incident_date, file_hash, created_by)
VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Encroachment Survey Map & Panchnama', 'Official municipal survey record confirming contested boundary demarcation and unauthorized wall structure.', 'DOCUMENT', 'Delhi Revenue & Survey Department', '2026-06-12 11:45:00+05:30', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '22222222-2222-2222-2222-222222222222'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'High-Res CCTV Vacation Footage', 'Surveillance clip recording unauthorized construction executed during High Court summer vacation.', 'DIGITAL', 'Hauz Khas Society Security Vault', '2026-06-18 16:30:00+05:30', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', '22222222-2222-2222-2222-222222222222'),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'MCGM Trade License Renewal Certificate', 'Original 5-year municipal commercial establishment trade certificate and GST payment receipts.', 'DOCUMENT', 'Municipal Corporation of Greater Mumbai', '2026-01-08 10:00:00+05:30', 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d', '55555555-5555-5555-5555-555555555555')
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------------
-- 6. SEED INTERCONNECTED NOTIFICATIONS
-- -------------------------------------------------------------------------
INSERT INTO notifications (user_id, title, message, type, is_read)
VALUES
((SELECT COALESCE((SELECT id FROM users WHERE email IN ('meetthacker816@gmail.com', 'citizen@ecourt.com', 'abc@gmail.com') LIMIT 1), '33333333-3333-3333-3333-333333333333'::uuid)), 'Advocate Assigned to Docket EC-DEL-2026-0042', 'Adv. Rajeshwar Sharma has been formally assigned to your case Meet Thacker vs. State of NCT Delhi.', 'SUCCESS', false),
((SELECT COALESCE((SELECT id FROM users WHERE email IN ('meetthacker816@gmail.com', 'citizen@ecourt.com', 'abc@gmail.com') LIMIT 1), '33333333-3333-3333-3333-333333333333'::uuid)), 'New Cause List Scheduled', 'Your hearing before Delhi High Court (Court No. 14) is scheduled for Aug 18, 2026 at 10:30 AM.', 'INFO', false),
('22222222-2222-2222-2222-222222222222', 'New Client Docket Connected', 'Meet Thacker vs. State of NCT Delhi has been synced to your active litigation chamber portfolio.', 'SUCCESS', false),
('55555555-5555-5555-5555-555555555555', 'Writ Petition Hearing Updated', 'Adv. Rajeshwar Sharma secured interim stay against MCGM license revocation until Sep 02, 2026.', 'INFO', false)
ON CONFLICT DO NOTHING;
