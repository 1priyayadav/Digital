const fs = require('fs');

async function run() {
  const content = fs.readFileSync('.env.local', 'utf-8');
  const url = content.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
  const keyParts = content.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY')).split('=');
  keyParts.shift();
  const key = keyParts.join('=').trim();

  // Next.js might bundle supabase-js, let's try to import from the dist if it fails
  let createClient;
  try {
    createClient = require('@supabase/supabase-js').createClient;
  } catch(e) {
    createClient = require('./node_modules/@supabase/supabase-js').createClient;
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('DB Error:', error);
  } else {
    console.log('PROFILES:', JSON.stringify(data, null, 2));
  }
}

run().catch(console.error);
