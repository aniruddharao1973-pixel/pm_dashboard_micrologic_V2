-- ================================
-- PROJECT MANAGEMENT - DATABASE SCHEMA
-- ================================
-- Author: ChatGPT
-- Date: 2025
-- =================================


-- ========== EXTENSIONS ==========
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ========== TABLE: users ==========
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
    must_change_password BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ========== TABLE: projects ==========
CREATE TABLE IF NOT EXISTS projects (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status      TEXT DEFAULT 'active',
    created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ========== TABLE: folders ==========
CREATE TABLE IF NOT EXISTS folders (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index: Faster folder fetch inside project
CREATE INDEX IF NOT EXISTS idx_folders_project
    ON folders(project_id);


-- ========== TABLE: documents ==========
CREATE TABLE IF NOT EXISTS documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    folder_id       UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    description     TEXT,
    current_version INT NOT NULL DEFAULT 1,
    status          TEXT DEFAULT 'submitted',
    can_download    BOOLEAN DEFAULT true,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index: Faster doc filtering inside folder
CREATE INDEX IF NOT EXISTS idx_documents_folder
    ON documents(folder_id);


-- ========== TABLE: document_versions ==========
CREATE TABLE IF NOT EXISTS document_versions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    file_path       TEXT NOT NULL,    -- /uploads/xxxx.pdf
    filename        TEXT NOT NULL,    -- original filename
    mimetype        TEXT NOT NULL,
    size            INT,
    version_number  INT NOT NULL,
    uploaded_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index: One document → many versions
CREATE INDEX IF NOT EXISTS idx_versions_document
    ON document_versions(document_id);

-- Unique index ensuring version numbers are not duplicated
CREATE UNIQUE INDEX IF NOT EXISTS unique_document_version
    ON document_versions(document_id, version_number);


-- ========== DEFAULT FOLDER GENERATION (OPTIONAL) ==========
-- You can run this AFTER creating a project
-- INSERT INTO folders (name, project_id)
-- VALUES 
--   ('Documents', '<project_id>'),
--   ('Drawings', '<project_id>'),
--   ('Approvals', '<project_id>'),
--   ('Notes', '<project_id>');


-- ========== DONE ==========
