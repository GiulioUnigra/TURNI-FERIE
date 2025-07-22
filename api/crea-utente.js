// Percorso: api/crea-utente.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const {
      nome,
      email,
      password,
      telefono_fisso,
      cellulare,
      gruppo,
      ruolo,
      tipo_turno,
      ore_accumulate,
      ore_annuali
    } = req.body;

    // 1. Crea l'utente in Supabase Auth
    const { data: userData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({ error: 'Errore Auth: ' + authError.message });
    }

    // 2. Inserisci nella tabella "dipendenti"
    const { error: insertError } = await supabase.from('dipendenti').insert({
      id: userData.user.id,
      nome,
      email,
      password,
      telefono_fisso,
      cellulare,
      gruppo: Array.isArray(gruppo) ? gruppo.join(',') : gruppo,
      ruolo,
      tipo_turno,
      ore_accumulate: ore_accumulate || 0,
      ore_annuali: ore_annuali || 0,
      attivo: true
    });

    if (insertError) {
      return res.status(500).json({ error: 'Errore DB: ' + insertError.message });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: 'Errore inatteso: ' + err.message });
  }
}
