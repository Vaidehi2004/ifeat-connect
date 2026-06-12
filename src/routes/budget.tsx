import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { budget, opportunities } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/budget")({
  head: () => ({ meta: [{ title: "Budget vs ROI — Rawji IFEAT 2026" }] }),
  component: BudgetPage,
});

function BudgetPage() {
  const totalBudget = budget.reduce((s, b) => s + b.budget, 0);
  const totalSpend = budget.reduce((s, b) => s + b.actual, 0);
  const weighted = opportunities.reduce((s, o) => s + o.revenue * o.probability, 0);
  const roi = (weighted / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        module="Module 6"
        title="Budget vs ROI"
        description="Spend across the IFEAT 2026 campaign measured against weighted pipeline value."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total budget</div>
          <div className="mt-1 text-2xl font-semibold">${(totalBudget / 1000).toFixed(0)}k</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Actual spend</div>
          <div className="mt-1 text-2xl font-semibold">${(totalSpend / 1000).toFixed(0)}k</div>
          <div className="text-xs text-muted-foreground">{Math.round((totalSpend / totalBudget) * 100)}% utilised</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Weighted pipeline</div>
          <div className="mt-1 text-2xl font-semibold text-[var(--gold)]">${(weighted / 1000).toFixed(0)}k</div>
        </CardContent></Card>
        <Card className="bg-gradient-to-br from-primary to-cyan-800 text-primary-foreground">
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wider opacity-80">Projected ROI</div>
            <div className="mt-1 text-3xl font-bold">{roi.toFixed(0)}%</div>
            <div className="text-xs opacity-80">vs total campaign budget</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Spend by category</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={budget} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={140} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="budget" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actual" fill="var(--gold)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Budget utilisation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {budget.map((b) => {
              const pct = Math.round((b.actual / b.budget) * 100);
              return (
                <div key={b.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{b.category}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      ${(b.actual / 1000).toFixed(1)}k / ${(b.budget / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="h-2 flex-1" />
                    <span className="w-10 text-right text-xs font-mono">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
