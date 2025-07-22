import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmcawwcrwqtmylhcbqwi.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const dati = req.body;

    // 1. Crea utente in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: dati.email,
      password: dati.password,
      email_confirm: true
    });

    if (authError) {
      console.error("Errore creazione auth:", authError);
      return res.status(500).json({ error: 'Errore creazione auth', dettagli: authError.message });
    }

    // 2. Inserisci in tabella dipendenti
    const { error: dbError } = await supabase.from('dipendenti').insert([{
      id: authData.user.id,
      nome: dati.nome,
      email: dati.email,
      password: dati.password,
      telefono_fisso: dati.telefono_fisso || '',
      cellulare: dati.cellulare || '',
      gruppo: dati.gruppo,
      ruolo: dati.ruolo,
      tipo_turno: dati.tipo_turno,
      ore_accumulate: dati.ore_accumulate,
      ore_annuali: dati.ore_annuali,
      attivo: true
    }]);

    if (dbError) {
      console.error("Errore inserimento DB:", dbError);
      return res.status(500).json({ error: 'Errore inserimento DB', dettagli: dbError.message });
    }

    return res.status(200).json({ successo: true });

  } catch (err) {
    console.error("Errore imprevisto:", err);
    return res.status(500).json({ error: 'Errore server', dettagli: err.message });
  }
}
