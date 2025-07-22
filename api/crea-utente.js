// File: /api/crea-utente.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // sicura nel server
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo non consentito' });
    return;
  }

  const { email, password, ...profilo } = req.body;

  try {
    const { data, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      res.status(400).json({ error: `Errore Auth: ${authError.message}` });
      return;
    }

    const id = data?.user?.id;
    if (!id) {
      res.status(500).json({ error: 'ID utente non generato.' });
      return;
    }

    const { error: dbError } = await supabase.from('dipendenti').insert({
      id,
      email,
      ...profilo,
      attivo: true
    });

    if (dbError) {
      res.status(500).json({ error: `Errore DB: ${dbError.message}` });
      return;
    }

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Errore inaspettato: ' + e.message });
  }
}
