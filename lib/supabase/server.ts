import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// TODO: uma vez que `supabase gen types typescript` for rodado contra um
// projeto real, importe `Database` de "@/types/database.types" e use
// createServerClient<Database>(...) para restaurar a tipagem das tabelas.

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Chamado de um Server Component sem permissão de escrita;
            // o proxy.ts cuida do refresh de sessão nesse caso.
          }
        },
      },
    }
  )
}
