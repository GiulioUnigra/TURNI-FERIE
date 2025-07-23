// Percorso: /api/crea-utente.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const id = req.query.id;

  if (req.method === 'POST') {
    const { email, password, ...profilo } = req.body;
    try {
      const { data, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) return res.status(400).json({ error: authError.message });

      const userId = data.user?.id;
      if (!userId) return res.status(500).json({ error: 'ID utente non generato.' });

      const { error: insertError } = await supabase.from('dipendenti').insert({
        id: userId,
        email,
        ...profilo,
        attivo: true
      });

      if (insertError) return res.status(500).json({ error: insertError.message });

      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Errore inaspettato: ' + e.message });
    }
  }

  if (req.method === 'PUT' && id) {
    try {
      const { password, ...profilo } = req.body;
      const { error } = await supabase.from('dipendenti').update(profilo).eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Errore durante aggiornamento: ' + e.message });
    }
  }

  if (req.method === 'DELETE' && id) {
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) return res.status(500).json({ error: 'Errore auth: ' + authError.message });

      const { error: dbError } = await supabase.from('dipendenti').delete().eq('id', id);
      if (dbError) return res.status(500).json({ error: 'Errore DB: ' + dbError.message });

      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Errore inatteso: ' + e.message });
    }
  }

  return res.status(405).json({ error: 'Metodo non consentito' });
}
