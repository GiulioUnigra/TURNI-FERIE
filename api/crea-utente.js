import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { email, password, ...profilo } = req.body;

  try {
    // Crea utente in Auth
    const { data: userData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({ error: `Errore Auth: ${authError.message}` });
    }

    const id = userData.user.id;

    // Inserisci in tabella dipendenti
    const { error: dbError } = await supabase.from('dipendenti').insert({
      id,
      email,
      password,
      ...profilo,
      attivo: true
    });

    if (dbError) {
      return res.status(500).json({ error: `Errore DB: ${dbError.message}` });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Errore inaspettato: ' + e.message });
  }
}
