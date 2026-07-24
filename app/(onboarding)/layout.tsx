export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-muted/30 p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Educamend Portal</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Vamos configurar tudo em poucos passos
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
