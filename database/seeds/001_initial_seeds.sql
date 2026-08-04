-- ===================================================
-- ECourt Seed Data: Initial System Test Users & Seed Data
-- Default password for test users: Password123! (bcrypt hash)
-- ===================================================

-- Password hash below corresponds to 'Password123!'
-- $2b$10$wT8K8U4S9UeH4aU6hY4m1.9G1x4Rz0tQ0hU0Vz1.5Z0W2Y1.3X0W2

INSERT INTO users (id, full_name, email, password_hash, role, phone_number, verification_status, bar_council_id, college_id, company_registration_no)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@ecourt.in', '$2b$10$wT8K8U4S9UeH4aU6hY4m1.9G1x4Rz0tQ0hU0Vz1.5Z0W2Y1.3X0W2', 'ADMIN', '+91 9876543210', 'VERIFIED', NULL, NULL, NULL),
('22222222-2222-2222-2222-222222222222', 'Adv. Rajesh Sharma', 'advocate@ecourt.in', '$2b$10$wT8K8U4S9UeH4aU6hY4m1.9G1x4Rz0tQ0hU0Vz1.5Z0W2Y1.3X0W2', 'ADVOCATE', '+91 9876543211', 'VERIFIED', 'MAH/1234/2015', NULL, NULL),
('33333333-3333-3333-3333-333333333333', 'Priya Verma (Citizen)', 'citizen@ecourt.in', '$2b$10$wT8K8U4S9UeH4aU6hY4m1.9G1x4Rz0tQ0hU0Vz1.5Z0W2Y1.3X0W2', 'CITIZEN', '+91 9876543212', 'VERIFIED', NULL, NULL, NULL),
('44444444-4444-4444-4444-444444444444', 'Aarav Patel (Student)', 'student@ecourt.in', '$2b$10$wT8K8U4S9UeH4aU6hY4m1.9G1x4Rz0tQ0hU0Vz1.5Z0W2Y1.3X0W2', 'LAW_STUDENT', '+91 9876543213', 'VERIFIED', NULL, 'NLSIU-2024-089', NULL),
('55555555-5555-5555-5555-555555555555', 'Nexus Retail Pvt Ltd', 'business@ecourt.in', '$2b$10$wT8K8U4S9UeH4aU6hY4m1.9G1x4Rz0tQ0hU0Vz1.5Z0W2Y1.3X0W2', 'BUSINESS', '+91 9876543214', 'VERIFIED', NULL, NULL, 'U72200MH2021PTC123456')
ON CONFLICT (email) DO NOTHING;

-- Initial Demo Case
INSERT INTO cases (id, case_number, title, description, court_name, statute_section, status, priority, client_id, advocate_id)
VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'EC-DEL-2026-0042', 'Priya Verma vs. State of NCT Delhi', 'Property title dispute and unauthorized encroachment claim under Bharatiya Nagarik Suraksha Sanhita', 'High Court of Delhi', 'BNS Sec 329 / BNSS Sec 144', 'UNDER_TRIAL', 'HIGH', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (case_number) DO NOTHING;

-- Initial Demo Hearings
INSERT INTO hearings (case_id, hearing_date, purpose, judge_name, outcome_notes, next_steps)
VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', CURRENT_TIMESTAMP + INTERVAL '5 days', 'Arguments on Stay Application & Verification of Land Survey Reports', 'Hon''ble Justice R. K. Gauba', 'Awaiting counter-affidavit filing by respondent', 'Advocate to file rejoinder within 3 days');
