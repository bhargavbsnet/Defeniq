-- DEFENIQ PostgreSQL Schema (AWS RDS PostgreSQL Database)
-- Deployed inside private subnets, accessible via RDS Proxy

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    inquiry_type VARCHAR(100) NOT NULL,
    timeline VARCHAR(50) NOT NULL,
    budget VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    email VARCHAR(255) PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(255) NOT NULL,
    read_time VARCHAR(50) DEFAULT '5 min read',
    tags TEXT[] NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    portfolio_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default administrative user (Password matches 'adminpassword' in mock)
-- In production, the password hash is salted and generated during deployment
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@defeniq.com', '$2b$10$wB5W8W6/b9s.D6D6Z2T8.eX5H5c6Q6m6D6G6o6u6e6s6p6a6s6s6w', 'Chief Tech Officer', 'admin')
ON CONFLICT (email) DO NOTHING;
