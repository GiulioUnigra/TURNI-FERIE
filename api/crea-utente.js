import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo non consentito' });
    return;
  }

  const { nome, email, password, gruppo, ...profilo } = req.body;

  // Email fittizia unica per auth
  const emailFittizia = nome.replace(/\s+/g, '').toLowerCase() + "+" + email;

  try {
    const { data, error: authError } = await supabase.auth.admin.createUser({
      email: emailFittizia,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error('Errore AUTH:', authError);
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
      email, // Email reale visibile nei dati dipendenti
      nome,
      gruppo: Array.isArray(gruppo) ? gruppo.join(',') : gruppo,
      ...profilo,
      attivo: true
    });

    if (dbError) {
      console.error('Errore DB:', dbError);
      res.status(500).json({ error: `Errore DB: ${dbError.message}` });
      return;
    }

    res.status(200).json({ success: true });
  } catch (e) {
    console.error('Errore server:', e);
    res.status(500).json({ error: 'Errore inaspettato: ' + e.message });
  }
}
