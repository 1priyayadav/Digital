import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testSignup() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test_dppriyayadav2004@gmail.com',
    password: 'password123',
  });
  console.log('Error:', error);
}

testSignup();
