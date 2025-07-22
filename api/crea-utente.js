// /api/crea-utente.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmcawwcrwqtmylhcbqwi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....' // Usa SERVICE_ROLE qui se server-side
);

export async function POST(request) {
  try {
    const nuovoDip = await request.json();

    const { data, error } = await supabase.from("dipendenti").insert([nuovoDip]);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Dipendente creato", data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
