import { createBrowserClient } from "@supabase/ssr"

// TODO: uma vez que `supabase gen types typescript` for rodado contra um
// projeto real, importe `Database` de "@/types/database.types" e use
// createBrowserClient<Database>(...) para restaurar a tipagem das tabelas.

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
