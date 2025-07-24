import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { email, password, ...profilo } = req.body;
    try {
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) throw authError;
      if (!authUser || !authUser.user || !authUser.user.id) throw new Error('ID utente non generato');

      const userId = authUser.user.id;
      const { error: insertError } = await supabase.from('dipendenti').insert([{ id: userId, email, ...profilo }]);
      if (insertError) throw insertError;

      return res.status(200).json({ message: 'Utente creato' });
    } catch (err) {
      console.error("Errore durante la creazione utente:", err);
      return res.status(500).json({ error: err.message, debug: err });
    }
  }

  if (method === 'PUT') {
    const id = req.query.id;
    const { password, ...aggiornamento } = req.body;
    try {
      if (password) {
        await supabase.auth.admin.updateUserById(id, { password });
      }
      const { error: updateError } = await supabase.from('dipendenti').update(aggiornamento).eq('id', id);
      if (updateError) throw updateError;

      return res.status(200).json({ message: 'Utente aggiornato' });
    } catch (err) {
      console.error("Errore durante aggiornamento:", err);
      return res.status(500).json({ error: err.message, debug: err });
    }
  }

  if (method === 'DELETE') {
    const id = req.query.id;
    try {
      await supabase.auth.admin.deleteUser(id);
      const { error: deleteError } = await supabase.from('dipendenti').delete().eq('id', id);
      if (deleteError) throw deleteError;

      return res.status(200).json({ message: 'Utente eliminato' });
    } catch (err) {
      console.error("Errore durante eliminazione:", err);
      return res.status(500).json({ error: err.message, debug: err });
    }
  }

  return res.status(405).json({ error: 'Metodo non consentito' });
}
