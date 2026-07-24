// Gerar com:
//   supabase gen types typescript --project-id <id> > types/database.types.ts
// depois que o projeto Supabase estiver criado e as migrations aplicadas.
// Depois de gerado, importe `Database` em lib/supabase/client.ts e
// lib/supabase/server.ts e passe como generic para createBrowserClient /
// createServerClient para restaurar a tipagem completa das tabelas.

export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, unknown> }>
  }
}
