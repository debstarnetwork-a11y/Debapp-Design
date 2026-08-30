-- PostgreSQL Database Schema for your Application
-- This can be imported into any standard PostgreSQL database (e.g., AWS RDS, DigitalOcean, custom server)

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    phone VARCHAR(50),
    location TEXT,
    logo_url TEXT,
    hero_image_about TEXT,
    hero_image_mission TEXT,
    hero_image_vision TEXT,
    hero_image_gallery TEXT,
    hero_image_contact TEXT,
    image_legacy TEXT,
    team_members JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings row if it doesn't exist
INSERT INTO settings (id, email, phone, location) 
VALUES (1, 'contact@example.com', '+1 234 567 8900', '123 Global Way')
ON CONFLICT (id) DO NOTHING;
