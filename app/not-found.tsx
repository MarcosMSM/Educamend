import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-sm text-muted-foreground">
        O conteúdo que você procura não existe ou você não tem acesso a ele.
      </p>
      <Button render={<Link href="/dashboard" />} nativeButton={false}>
        Voltar ao início
      </Button>
    </div>
  )
}
