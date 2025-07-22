<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Gestione Dipendenti</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f9fdf9;
      padding: 20px;
    }
    h2 {
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    input, select, button, textarea {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      box-sizing: border-box;
    }
    button {
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }
    button:hover {
      background-color: #45a049;
    }
    .error {
      color: red;
      text-align: center;
    }
    .back-home {
      display: block;
      width: fit-content;
      margin: 0 auto 20px auto;
      text-align: center;
      padding: 8px 16px;
      background-color: #ccc;
      color: #000;
      border-radius: 5px;
      text-decoration: none;
    }
    .back-home:hover {
      background-color: #bbb;
    }
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
    }
    .checkbox-group label {
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <a href="home.html" class="back-home">⬅ Torna alla Home</a>
  <h2>🧑‍💼 Gestione Dipendenti</h2>
  <div class="container">
    <div id="permesso_negato" class="error" style="display: none;">Accesso non autorizzato. Solo responsabili, viceresponsabili e referenti possono accedere.</div>
    <div id="form_container" style="display: none;">
      <label for="dipendente_selezionato">Modifica dipendente</label>
      <select id="dipendente_selezionato">
        <option value="">-- Nuovo dipendente --</option>
      </select>

      <label for="nome">Nome</label>
      <input id="nome" type="text">

      <label for="email">Email</label>
      <input id="email" type="email">

      <label for="password">Password</label>
      <input id="password" type="password">

      <label for="telefono_fisso">Telefono Fisso (opzionale)</label>
      <input id="telefono_fisso" type="text">

      <label for="cellulare">Cellulare (opzionale)</label>
      <input id="cellulare" type="text">

      <label>Gruppo (uno o più)</label>
      <div id="gruppo" class="checkbox-group"></div>

      <label for="ruolo">Ruolo</label>
      <select id="ruolo">
        <option>Analista</option>
        <option>Referente</option>
        <option>Responsabile</option>
        <option>Viceresponsabile</option>
      </select>

      <label for="tipo_turno">Tipo Turno</label>
      <select id="tipo_turno">
        <option>Standard</option>
        <option>Altro</option>
        <option>Ciclo Continuo</option>
      </select>

      <label for="ore_accumulate">Ore accumulate (precedenti)</label>
      <input id="ore_accumulate" type="number" step="0.01">

      <label for="ore_annuali">Monte ore annuali</label>
      <input id="ore_annuali" type="number" step="0.01">

      <button id="salva_btn">Salva Dipendente</button>
      <div id="messaggio" class="error"></div>
    </div>
  </div>

  <script type="module">
    import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

    const supabase = createClient(
      'https://lmcawwcrwqtmylhcbqwi.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtY2F3d2Nyd3F0bXlsaGNicXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDE1MDgsImV4cCI6MjA2ODY3NzUwOH0.mR9jK7S9Bkdf75XqLcMKj7nvRFqmMWLj9Km2QZ6uluE'
    );

    const utente = JSON.parse(localStorage.getItem("utenteLoggato"));
    const ruolo = utente?.ruolo;
    const gruppiGestiti = Array.isArray(utente?.gruppi_gestiti) ? utente.gruppi_gestiti : (utente?.gruppi_gestiti || "").split(",").map(g => g.trim());

    if (!utente || ruolo === "Analista") {
      document.getElementById("permesso_negato").style.display = "block";
    } else {
      document.getElementById("form_container").style.display = "block";
    }

    // resto invariato
  </script>
</body>
</html>
