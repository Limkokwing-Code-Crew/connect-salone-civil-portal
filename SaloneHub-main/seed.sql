CREATE DATABASE IF NOT EXISTS salonehub;
USE salonehub;

CREATE TABLE IF NOT EXISTS services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  agency VARCHAR(255),
  fee VARCHAR(100),
  processing_time VARCHAR(100),
  documents TEXT,
  eligibility TEXT,
  process_steps TEXT,
  locations TEXT,
  contacts TEXT,
  notes TEXT,
  last_verified DATE,
  region VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS representatives (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  role VARCHAR(100),
  district VARCHAR(100),
  constituency VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS agencies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  contact VARCHAR(255),
  email VARCHAR(255),
  website VARCHAR(255),
  region VARCHAR(100),
  description TEXT
);

INSERT INTO services (name, agency, fee, processing_time, documents, eligibility, process_steps, locations, contacts, notes, last_verified, region) VALUES
('Voter Registration', 'ECSL', 'NLe 0', '2 days', 'National ID, Birth certificate', '18+ Sierra Leonean citizen', 'Visit ECSL center → Capture biometrics → Receive slip', 'Freetown, Bo, Kenema, Makeni', 'info@ec.gov.sl / 076-000-000', 'Beware of middlemen; registration is free', '2024-12-01', 'Freetown'),
('National ID (NIN)', 'NCRA', 'NLe 120', '5 days', 'Birth certificate, Proof of residence', 'Citizens and legal residents', 'Fill NCRA form → Biometrics → Pickup ID', 'Freetown, Bo, Kenema, Makeni', 'support@ncra.gov.sl / 078-111-111', 'Pay only official receipt at NCRA desk', '2024-12-02', 'Bo'),
('Business Registration', 'CAC', 'NLe 450', '7 days', 'Name search, ID, Tax ID', '18+ applicants', 'Name search → Submit forms → Pay fees → Certificate', 'Freetown', 'info@cac.gov.sl / 079-222-222', 'Use CAC cash office only; avoid agents', '2024-12-03', 'Freetown'),
('Driver''s License', 'SLRSA', 'NLe 350', '10 days', 'Learner permit, Medical certificate', 'Passed driving test', 'Apply → Test → Pay → Collect license', 'Freetown, Bo', 'help@slrsa.gov.sl / 077-333-333', 'Testing centers only; no roadside payments', '2024-12-04', 'Bo'),
('Passport Renewal', 'Immigration', 'NLe 850', '10 days', 'Old passport, ID, Payment receipt', 'Existing passport holders', 'Book appointment → Biometrics → Collect passport', 'Freetown, Makeni', 'contact@immigration.gov.sl / 079-444-444', 'Do not pay extra for “express” outside office', '2024-12-05', 'Makeni'),
('Birth Certificate', 'NCRA', 'NLe 80', '3 days', 'Hospital letter, Parents ID', 'Newborns and adults', 'Submit documents → Pay → Collect certificate', 'Freetown, Kenema', 'support@ncra.gov.sl / 078-111-111', 'Fees are fixed; insist on receipt', '2024-12-06', 'Kenema'),
('Tax Identification', 'NRA', 'NLe 0', '2 days', 'National ID, Proof of address', 'Individuals and businesses', 'Fill TIN form → Submit → Receive TIN', 'Freetown', 'tin@nra.gov.sl / 076-555-555', 'TIN is free; report unofficial charges', '2024-12-07', 'Freetown'),
('Customs Clearance', 'NRA Customs', 'Varies', '4 days', 'Bill of lading, Invoice, ID', 'Importers/exporters', 'Pre-clearance → Duties → Inspection → Release', 'Queen Elizabeth II Quay', 'customs@nra.gov.sl / 030-666-666', 'Use official tariffs; avoid cash to agents', '2024-12-08', 'Freetown'),
('Fisheries License', 'MFMR', 'NLe 600', '6 days', 'Boat registration, ID', 'Fishing operators', 'Apply → Inspection → Pay → Permit', 'Tombo, Goderich', 'permits@mfmr.gov.sl / 033-777-777', 'Verify permit hologram; no beach payments', '2024-12-09', 'Freetown'),
('Tourism Permit', 'NTB', 'NLe 300', '5 days', 'Business registration, ID', 'Tour operators/hospitality', 'Submit dossier → Pay → Site review → Permit', 'Freetown', 'info@tourism.gov.sl / 031-888-888', 'Official receipts only; inspections are scheduled', '2024-12-10', 'Freetown');

INSERT INTO representatives (name, role, district, constituency, phone, email) VALUES
('Hon. Mohamed Bangura','Member of Parliament','Freetown','Constituency 001','076000101','m.bangura@parliament.sl'),
('Hon. Fatmata Sesay','Member of Parliament','Bo','Constituency 025','076000102','f.sesay@parliament.sl'),
('Hon. Sahr Kamara','Member of Parliament','Kenema','Constituency 040','076000103','s.kamara@parliament.sl'),
('Hon. Aminata Conteh','Member of Parliament','Makeni','Constituency 055','076000104','a.conteh@parliament.sl'),
('Councillor James Koroma','Local Council','Freetown','Ward 002','076000105','j.koroma@council.sl'),
('Councillor Mary Kallon','Local Council','Bo','Ward 018','076000106','m.kallon@council.sl'),
('Councillor Josephine Pratt','Local Council','Kenema','Ward 030','076000107','j.pratt@council.sl'),
('Councillor Abdul Turay','Local Council','Makeni','Ward 045','076000108','a.turay@council.sl'),
('Hon. Idrissa Jalloh','Member of Parliament','Port Loko','Constituency 060','076000109','i.jalloh@parliament.sl'),
('Hon. Hawa Mansaray','Member of Parliament','Kono','Constituency 070','076000110','h.mansaray@parliament.sl'),
('Hon. Peter Samura','Member of Parliament','Tonkolili','Constituency 080','076000111','p.samura@parliament.sl'),
('Hon. Mariama Bah','Member of Parliament','Bombali','Constituency 090','076000112','m.bah@parliament.sl'),
('Hon. Samuel Kargbo','Member of Parliament','Kailahun','Constituency 100','076000113','s.kargbo@parliament.sl'),
('Hon. Isata Bangalie','Member of Parliament','Bonthe','Constituency 110','076000114','i.bangalie@parliament.sl'),
('Councillor Francis Cole','Local Council','Pujehun','Ward 120','076000115','f.cole@council.sl'),
('Councillor Alice Pratt','Local Council','Kambia','Ward 130','076000116','a.pratt@council.sl'),
('Councillor David Conteh','Local Council','Moyamba','Ward 140','076000117','d.conteh@council.sl'),
('Councillor Grace Sesay','Local Council','Tonkolili','Ward 150','076000118','g.sesay@council.sl'),
('Councillor Paul Rogers','Local Council','Kono','Ward 160','076000119','p.rogers@council.sl'),
('Councillor Mariatu Bah','Local Council','Karene','Ward 170','076000120','m.bah@council.sl');

INSERT INTO agencies (name, contact, email, website, region, description) VALUES
('ECSL','Communications Unit','info@ec.gov.sl','https://ec.gov.sl','National','Electoral Commission of Sierra Leone'),
('NCRA','Service Desk','support@ncra.gov.sl','https://ncra.gov.sl','National','National Civil Registration Authority'),
('CAC','Front Desk','info@cac.gov.sl','https://cac.gov.sl','Freetown','Corporate Affairs Commission'),
('SLRSA','Customer Care','help@slrsa.gov.sl','https://slrsa.gov.sl','National','Sierra Leone Road Safety Authority'),
('Immigration','Passport Desk','contact@immigration.gov.sl','https://immigration.gov.sl','National','Immigration Department');

