-- Schema for Golf Charity Subscription Platform

-- 1. Drop existing tables safely to prevent "already exists" errors
DROP TABLE IF EXISTS winnings CASCADE;
DROP TABLE IF EXISTS jackpot CASCADE;
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS draws CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS charities CASCADE;

-- 2. Drop existing types to prevent "already exists" errors
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS draw_mode CASCADE;
DROP TYPE IF EXISTS winning_status CASCADE;
DROP TYPE IF EXISTS winning_match_type CASCADE;

-- 3. Create fresh Custom types
CREATE TYPE subscription_status AS ENUM ('active', 'renewal_pending', 'cancelled', 'lapsed');
CREATE TYPE draw_mode AS ENUM ('random', 'algorithmic');
CREATE TYPE winning_status AS ENUM ('pending', 'verified', 'paid');
CREATE TYPE winning_match_type AS ENUM ('3', '4', '5');

-- 4. Create Tables
-- Charities table
CREATE TABLE charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'subscriber', -- 'admin' or 'subscriber'
  charity_id UUID REFERENCES charities(id),
  charity_percentage NUMERIC DEFAULT 10 CHECK (charity_percentage >= 10),
  stripe_customer_id TEXT,
  subscription_status subscription_status DEFAULT 'lapsed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Scores table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 1 AND score <= 45),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Draws table
CREATE TABLE draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  logic_type draw_mode DEFAULT 'random',
  matching_numbers INTEGER[], -- Array of 5 numbers
  total_pool_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(month, year)
);

-- Winnings table
CREATE TABLE winnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  match_type winning_match_type NOT NULL,
  amount NUMERIC NOT NULL,
  proof_url TEXT,
  status winning_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jackpot Tracker
CREATE TABLE jackpot (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  current_amount NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Helper trigger function to maintain only latest 5 scores per user
CREATE OR REPLACE FUNCTION maintain_five_scores()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM scores
  WHERE user_id = NEW.user_id
    AND id NOT IN (
      SELECT id FROM scores
      WHERE user_id = NEW.user_id
      ORDER BY created_at DESC
      LIMIT 5
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_five_scores ON scores;
CREATE TRIGGER check_five_scores
AFTER INSERT ON scores
FOR EACH ROW EXECUTE PROCEDURE maintain_five_scores();

-- 6. Set up RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE winnings ENABLE ROW LEVEL SECURITY;

-- 7. Add basic viewing policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Charities are viewable by everyone" ON charities FOR SELECT USING (true);

CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
