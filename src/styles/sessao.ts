import { supabase } from '../services/supabase';

// O Supabase é a fonte da verdade sobre quem está logado.
// Esta variável é só um espelho dele, para as telas que perguntam
// de forma síncrona com estaLogado().
let logado = false;

supabase.auth.getSession().then(({ data }) => {
  logado = !!data.session;
});

supabase.auth.onAuthStateChange((_evento, session) => {
  logado = !!session;
});

export function estaLogado(): boolean {
  return logado;
}

// Mantidas para não quebrar quem já importa essas funções.
export function iniciarSessao(): void {
  logado = true;
}

export function encerrarSessao(): void {
  logado = false;
}