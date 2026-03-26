-- Seed data for charities
INSERT INTO charities (name, description, image_url, is_featured)
VALUES 
  (
    'First Tee', 
    'Impacting the lives of young people by providing educational programs that build character, instil life-enhancing values and promote healthy choices through the game of golf.', 
    'https://images.unsplash.com/photo-1587334274328-64186a80aee6?q=80&w=800', 
    true
  ),
  (
    'Global Food Initiative', 
    'Working to end world hunger by supporting sustainable agriculture and providing emergency food aid globally.', 
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800', 
    false
  ),
  (
    'Ocean Cleanup Fund', 
    'Dedicated to removing plastic from the world''s oceans through innovative technology and volunteer operations.', 
    'https://images.unsplash.com/photo-1621451537084-482c73073e0f?q=80&w=800', 
    false
  ),
  (
    'Adobe Foundation', 
    'Empowering communities through digital literacy, creative software access, and art education for underprivileged youth.', 
    'https://images.unsplash.com/photo-1616422285623-14ff01621e7d?q=80&w=800', 
    false
  );
