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

  try {
    const { nome, email, password, gruppo, ...profilo } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Dati mancanti' });
    }

    // Email fittizia unica per auth
    const emailFittizia = `${nome.replace(/\s+/g, '').toLowerCase()}+${email}`;

    const { data, error: authError } = await supabase.auth.admin.createUser({
      email: emailFittizia,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({ error: `Errore Auth: ${authError.message}` });
    }

    const id = data?.user?.id;
    if (!id) {
      return res.status(500).json({ error: 'ID utente non generato.' });
    }

    const gruppoStr = Array.isArray(gruppo) ? gruppo.join(',') : gruppo;

    const { error: dbError } = await supabase.from('dipendenti').insert({
      id,
      email,
      nome,
      gruppo: gruppoStr,
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
