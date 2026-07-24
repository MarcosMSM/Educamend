import { Sparkles } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { JourneyInsight } from "@/lib/data/journey"

export function AiInsightsCard({ insights }: { insights: JourneyInsight[] }) {
  if (insights.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Insights da IA
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className="grid gap-1.5">
            <p className="text-sm">{insight.message}</p>
            {insight.suggestions.length > 0 && (
              <ul className="grid gap-1 pl-4 text-sm text-muted-foreground">
                {insight.suggestions.map((suggestion) => (
                  <li key={suggestion} className="list-disc">
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
