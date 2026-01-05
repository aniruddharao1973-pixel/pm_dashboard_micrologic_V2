-- RESET (optional, remove if not needed)
TRUNCATE TABLE document_versions RESTART IDENTITY CASCADE;
TRUNCATE TABLE documents RESTART IDENTITY CASCADE;
TRUNCATE TABLE folders RESTART IDENTITY CASCADE;
TRUNCATE TABLE projects RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

------------------------------------------------------
-- 1️⃣ Insert Admin User
------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role, must_change_password)
VALUES (
  '3dc9fb62-c75f-4ca8-9369-8e3630a20299',
  'Admin',
  'admin@example.com',
  '$2b$12$6iSpvFd2yGEQ9iLD.8s66ec8j1xbukZ4PzLFcNkNr/svvIhbdmuKS',
  'admin',
  false
);

------------------------------------------------------
-- 2️⃣ Insert Customer User
------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role, must_change_password)
VALUES (
  '9f1c2d01-7c0f-4a33-9d55-fd88b0c3c999',
  'Test Customer',
  'customer@example.com',
  '$2b$12$6iSpvFd2yGEQ9iLD.8s66ec8j1xbukZ4PzLFcNkNr/svvIhbdmuKS',
  'customer',
  false
);

------------------------------------------------------
-- 3️⃣ Insert Project (Created by Admin)
------------------------------------------------------
INSERT INTO projects (id, name, customer_id, status, created_by)
VALUES (
  '07e84572-c32f-437e-94bf-ec354c29ea6c',
  'Test Project 1',
  NULL,
  'active',
  '3dc9fb62-c75f-4ca8-9369-8e3630a20299'
);

------------------------------------------------------
-- 4️⃣ Insert Default Folders
------------------------------------------------------
INSERT INTO folders (id, project_id, name, is_default)
VALUES
  ('e12a72a2-6444-4a11-afde-00e520789824', '07e84572-c32f-437e-94bf-ec354c29ea6c', 'Documents', true),
  ('aa9f9c91-6eef-40a6-a1e6-2b84804ca2e4', '07e84572-c32f-437e-94bf-ec354c29ea6c', 'Drawings', true),
  ('d2cd786a-b7ce-4393-a0ab-d02ff6dede60', '07e84572-c32f-437e-94bf-ec354c29ea6c', 'Approvals', true),
  ('11731b81-3951-4f12-aa69-609806bbbbf8d', '07e84572-c32f-437e-94bf-ec354c29ea6c', 'Notes', true);
