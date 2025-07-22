// /api/crea-utente.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmcawwcrwqtmylhcbqwi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtY2F3d2Nyd3F0bXlsaGNicXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzEwMTUwOCwiZXhwIjoyMDY4Njc3NTA4fQ.YCd4Zx0C1gyxjCyiXLrXXoj0FOeuXt1YAGJEqbzTL34'
);

export async function POST(request) {
  try {
    const nuovoDip = await request.json();

    const { data, error } = await supabase.from("dipendenti").upsert([nuovoDip], { onConflict: ['email'] });
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: "Dipendente salvato con successo", data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
