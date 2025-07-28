// file: index.js (dentro la funzione Edge 'crea-utente')
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Inizializza il client con le variabili ambiente protette
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
)

Deno.serve(async (req) => {
  const { method } = req

  try {
    const url = new URL(req.url)

    // Se il metodo è POST, crea un nuovo utente
    if (method === 'POST') {
      const { email, password, ...profilo } = await req.json()

      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      })

      if (authError) throw authError
      if (!authUser?.user?.id) throw new Error("ID utente non generato")

      const userId = authUser.user.id
      const { error: insertError } = await supabase
        .from('dipendenti')
        .insert([{ id: userId, email, ...profilo }])

      if (insertError) throw insertError

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Se il metodo è PUT, aggiorna l'utente
    if (method === 'PUT') {
      const id = url.searchParams.get('id')
      if (!id) throw new Error("ID utente mancante")
      const { password, ...aggiornamento } = await req.json()

      if (password) {
        await supabase.auth.admin.updateUserById(id, { password })
      }

      const { error: updateError } = await supabase
        .from('dipendenti')
        .update(aggiornamento)
        .eq('id', id)

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Se il metodo è DELETE, elimina l'utente
    if (method === 'DELETE') {
      const id = url.searchParams.get('id')
      if (!id) throw new Error("ID utente mancante")

      await supabase.auth.admin.deleteUser(id)

      const { error: deleteError } = await supabase
        .from('dipendenti')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Metodo non supportato
    return new Response(JSON.stringify({ error: 'Metodo non consentito' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Errore:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
