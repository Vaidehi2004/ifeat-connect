import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { opportunities, type Opportunity } from "@/lib/mock-data";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Opportunity Pipeline — Rawji IFEAT 2026" }] }),
  component: PipelinePage,
});

const stages: Opportunity["stage"][] = ["Discovery", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

const typeColor: Record<Opportunity["type"], string> = {
  Distribution: "bg-primary/15 text-primary",
  "Direct Manufacturing": "bg-[var(--gold)]/25 text-amber-800",
  "Joint Venture": "bg-violet-100 text-violet-800",
  "Toll Manufacturing": "bg-emerald-100 text-emerald-800",
};

function PipelinePage() {
  const totalRev = opportunities.reduce((s, o) => s + o.revenue, 0);
  const weighted = opportunities.reduce((s, o) => s + o.revenue * o.probability, 0);
  const won = opportunities.filter((o) => o.stage === "Closed Won").reduce((s, o) => s + o.revenue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        module="Module 5"
        title="Opportunity Pipeline"
        description="Distribution, direct manufacturing, JV and toll opportunities — weighted by stage probability."
        actions={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add opportunity</Button>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total pipeline", value: `$${(totalRev / 1000).toFixed(0)}k` },
          { label: "Weighted", value: `$${(weighted / 1000).toFixed(0)}k`, accent: "text-[var(--gold)]" },
          { label: "Closed Won", value: `$${(won / 1000).toFixed(0)}k`, accent: "text-success" },
          { label: "Open deals", value: opportunities.filter((o) => !o.stage.startsWith("Closed")).length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className={`mt-1 text-2xl font-semibold ${s.accent ?? ""}`}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2">
        {stages.map((stage) => {
          const items = opportunities.filter((o) => o.stage === stage);
          const sum = items.reduce((s, o) => s + o.revenue, 0);
          return (
            <div key={stage} className="rounded-xl bg-muted/40 p-3">
              <div className="flex items-center justify-between px-1 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold">{stage}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">{items.length}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">${(sum / 1000).toFixed(0)}k</span>
              </div>
              <div className="space-y-2">
                {items.map((o) => (
                  <Card key={o.id} className="cursor-grab transition hover:shadow-md">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-sm">{o.company}</div>
                        <span className="font-mono text-[10px] text-muted-foreground">{o.id}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{o.country} · {o.region}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColor[o.type]}`}>{o.type}</span>
                      </div>
                      <div className="mt-3 flex items-end justify-between border-t border-border pt-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                          <div className="font-mono text-sm font-semibold">${(o.revenue / 1000).toFixed(0)}k</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Prob.</div>
                          <div className="font-mono text-sm font-semibold text-[var(--gold)]">{Math.round(o.probability * 100)}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                    No deals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
