// /api/crea-utente.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  'https://lmcawwcrwqtmylhcbqwi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtY2F3d2Nyd3F0bXlsaGNicXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzEwMTUwOCwiZXhwIjoyMDY4Njc3NTA4fQ.YCd4Zx0C1gyxjCyiXLrXXoj0FOeuXt1YAGJEqbzTL34'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const nuovoDip = req.body;
  if (!nuovoDip?.email || !nuovoDip?.password || !nuovoDip?.nome) {
    return res.status(400).json({ error: 'Email, password e nome sono obbligatori' });
  }

  try {
    const { data: user, error: signupError } = await supabaseAdmin.auth.admin.createUser({
      email: nuovoDip.email,
      password: nuovoDip.password,
      email_confirm: true
    });

    if (signupError) throw signupError;

    const insertData = {
      id: user.user.id,
      nome: nuovoDip.nome,
      email: nuovoDip.email,
      password: nuovoDip.password,
      telefono_fisso: nuovoDip.telefono_fisso || '',
      cellulare: nuovoDip.cellulare || '',
      gruppo: nuovoDip.gruppo,
      ruolo: nuovoDip.ruolo,
      tipo_turno: nuovoDip.tipo_turno,
      ore_accumulate: nuovoDip.ore_accumulate,
      ore_annuali: nuovoDip.ore_annuali,
      attivo: true
    };

    const { error: insertError } = await supabaseAdmin.from('dipendenti').insert(insertData);
    if (insertError) throw insertError;

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
