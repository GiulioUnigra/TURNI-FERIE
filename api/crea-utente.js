// /api/crea-utente.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmcawwcrwqtmylhcbqwi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtY2F3d2Nyd3F0bXlsaGNicXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzEwMTUwOCwiZXhwIjoyMDY4Njc3NTA4fQ.YCd4Zx0C1gyxjCyiXLrXXoj0FOeuXt1YAGJEqbzTL34'
);

export async function POST(request) {
 try {
  const response = await fetch('/api/crea-utente', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuovoDip)
  });

  const text = await response.text(); // leggiamo sempre prima come testo

  if (!response.ok) {
    throw new Error(text);
  }

  let result;
  try {
    result = JSON.parse(text);
  } catch (e) {
    throw new Error("Errore del server (risposta non JSON): " + text);
  }

  if (result.error) {
    throw new Error(result.error.message || "Errore generico");
  }

  document.getElementById("messaggio").textContent = "✅ Dipendente salvato!";
  document.getElementById("messaggio").style.color = "green";

} catch (error) {
  console.error("Errore nel salvataggio:", error);
  document.getElementById("messaggio").textContent = "Errore: " + error.message;
  document.getElementById("messaggio").style.color = "red";
}
