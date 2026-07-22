CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  period VARCHAR(100) NOT NULL,
  role VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  type VARCHAR(100) DEFAULT 'Internship',
  bullets TEXT NOT NULL,
  tags TEXT NOT NULL,
  documents TEXT,
  photos TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(100),
  description TEXT NOT NULL,
  tech TEXT NOT NULL,
  badge VARCHAR(100),
  badge_type VARCHAR(50) DEFAULT 'badge-blue',
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  banner_image VARCHAR(500),
  shape VARCHAR(50) DEFAULT 'torus',
  color1 VARCHAR(20) DEFAULT '0x1e3a8a',
  color2 VARCHAR(20) DEFAULT '0x60a5fa',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100) DEFAULT 'Frontend Development',
  key_name VARCHAR(100),
  logo_url VARCHAR(500),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  year VARCHAR(50),
  description TEXT,
  issuer VARCHAR(200),
  type VARCHAR(50) DEFAULT 'award',
  certificate_image VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  subject VARCHAR(300),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO experience (period, role, company, type, bullets, tags) VALUES 
('2025 Nov — 2026 May', 'Intern Software Engineer', 'HABB (PVT) Ltd', 'Internship', '["Developed and maintained web application features based on stakeholder requirements, contributing to both frontend and backend implementation using modern frameworks.","Designed and optimized database schemas and REST API endpoints to support core business workflows, improving data retrieval efficiency.","Built internal reporting and dashboard modules, reducing manual data processing steps and enhancing operational visibility.","Collaborated with design and backend teams in an Agile/Scrum environment, participating in sprints to ensure timely and on-spec feature delivery."]', '["React","Node.js","REST API","MySQL","Agile/Scrum"]'),
('2022 Sep — 2023 Mar', 'Internship – IT Technician', 'University of Jaffna – General Administration Department', 'Internship', '["Installed, configured, and maintained hardware and software systems, ensuring reliable IT infrastructure for daily administrative operations.","Diagnosed and resolved technical issues, preparing incident reports and maintenance logs to support data-driven operational decision-making.","Coordinated with administrative staff to gather technical requirements and deliver effective, timely IT solutions."]', '["Hardware","Software Systems","IT Infrastructure","Technical Support"]');

INSERT INTO projects (title, type, description, tech, badge, badge_type, github_url) VALUES 
('AI Receptionist System', 'Final Year Project | Group', 'Full stack AI-powered receptionist system with React frontend and Django REST backend, integrated with a multi-agent architecture for appointment booking, patient coordination, and automated data handling.', '["React","Django","PostgreSQL","MongoDB","Multi-Agent AI"]', 'AI / Full Stack', 'badge-blue', 'https://github.com/Jeyarakavan'),
('Patient Management System', 'Group Project | 2 Months', 'Full stack web application using Node.js and MongoDB with a responsive Bootstrap frontend to streamline hospital record management, appointment scheduling, and staff coordination.', '["HTML","Bootstrap","Node.js","MongoDB","REST API"]', 'Healthcare', 'badge-cyan', 'https://github.com/Jeyarakavan'),
('CSE Stock Analysis Android App', 'Group Project | 2 Months', 'Full-featured Android application integrating REST APIs and SQLite to collect, store, and visualise Colombo Stock Exchange data including financial ratios, price trends, and technical indicators.', '["Java","Kotlin","REST APIs","SQLite","Firebase","MPAndroidChart"]', 'Android App', 'badge-purple', 'https://github.com/Jeyarakavan'),
('FastTrack Logistics Automation', 'Individual Project', 'Desktop application with Java Swing UI and MySQL backend to automate shipment tracking, driver assignment, and monthly reporting for a logistics company.', '["Java","Swing","MySQL"]', 'Desktop App', 'badge-teal', 'https://github.com/Jeyarakavan');

INSERT INTO achievements (title, year, type) VALUES 
('Q4US Codeart Challenge – Winners', '2025', 'award'),
('SLIIT Codefest NETCOM – Merit Award', '2025', 'award'),
('Marketing Video Clip Competition – Winners', '2025', 'award'),
('SLIIT Codefest ALGOTHAN – Merit Award', '2024', 'award');
