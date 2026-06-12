import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  LineChart, Line, Legend, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { ArrowUpRight, Target, Mail, Handshake, Globe2, TrendingUp, Trophy } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { kpis, funnel, regionData, outreachTimeline } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Rawji IFEAT 2026" },
      { name: "description", content: "Real-time campaign KPIs for IFEAT 2026 Bangkok." },
    ],
  }),
  component: Dashboard,
});

const fmt = (n: number, currency = false) =>
  currency ? `$${(n / 1000).toFixed(0)}k` : n.toLocaleString();

const heroKpis = [
  { key: "Principals Identified", icon: Target, accent: "from-primary to-cyan-700" },
  { key: "Meetings Confirmed", icon: Handshake, accent: "from-emerald-600 to-emerald-800" },
  { key: "Qualified Opportunities", icon: TrendingUp, accent: "from-amber-500 to-orange-700" },
  { key: "Countries Covered", icon: Globe2, accent: "from-violet-600 to-indigo-800" },
];

function Dashboard() {
  const byKey = Object.fromEntries(kpis.map((k) => [k.name, k]));
  const totalTarget = kpis.reduce((s, k) => s + k.target, 0);
  const totalActual = kpis.reduce((s, k) => s + k.actual, 0);
  const overall = Math.round((totalActual / totalTarget) * 100);

  return (
    <div className="space-y-8">
      <PageHeader
        module="Module 1"
        title="Executive Dashboard"
        description="Live performance across acquisition, outreach, meetings, pipeline and geographic expansion."
        actions={
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
            <Trophy className="h-3.5 w-3.5 text-[var(--gold)]" />
            Overall attainment: {overall}%
          </Badge>
        }
      />

      {/* Hero KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {heroKpis.map(({ key, icon: Icon, accent }) => {
          const k = byKey[key];
          const pct = Math.min(100, Math.round((k.actual / k.target) * 100));
          return (
            <Card key={key} className="relative overflow-hidden border-border/60">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{key}</div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-semibold tracking-tight">{k.actual}</span>
                      <span className="text-sm text-muted-foreground">/ {k.target}</span>
                    </div>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white shadow`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Progress value={pct} className="h-1.5 flex-1" />
                  <span className="text-xs font-medium text-foreground">{pct}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pipeline Funnel</CardTitle>
            <Badge variant="outline" className="font-mono text-xs">Conversion {Math.round((funnel[funnel.length - 1].count / funnel[0].count) * 100)}%</Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={funnel} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent className="flex h-72 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "p", value: Math.round((byKey["Pipeline Value"].actual / byKey["Pipeline Value"].target) * 100), fill: "var(--chart-2)" }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <div className="text-3xl font-semibold">{fmt(byKey["Pipeline Value"].actual, true)}</div>
              <div className="text-xs text-muted-foreground">of {fmt(byKey["Pipeline Value"].target, true)} target</div>
              <div className="mt-2 text-xs text-[var(--gold)]">Weighted {fmt(byKey["Weighted Pipeline"].actual, true)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Outreach by Channel (last 12 weeks)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <LineChart data={outreachTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="emails" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="linkedin" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="whatsapp" stroke="var(--chart-3)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geographic Reach</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={regionData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={100} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="principals" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="meetings" fill="var(--gold)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Full KPI grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All KPIs vs Target</CardTitle>
          <a className="flex items-center gap-1 text-xs text-primary hover:underline" href="#">
            Export report <ArrowUpRight className="h-3 w-3" />
          </a>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 font-medium">KPI</th>
                  <th className="font-medium">Group</th>
                  <th className="font-medium">Target</th>
                  <th className="font-medium">Actual</th>
                  <th className="w-1/3 font-medium">Attainment</th>
                  <th className="font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((k) => {
                  const pct = Math.round((k.actual / k.target) * 100);
                  const status =
                    pct >= 90 ? { label: "On track", cls: "bg-success/15 text-success" } :
                    pct >= 60 ? { label: "At risk", cls: "bg-warning/20 text-warning-foreground" } :
                    { label: "Behind", cls: "bg-destructive/15 text-destructive" };
                  return (
                    <tr key={k.name} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">{k.name}</td>
                      <td className="text-muted-foreground">{k.group}</td>
                      <td className="font-mono">{fmt(k.target, k.currency)}</td>
                      <td className="font-mono font-semibold">{fmt(k.actual, k.currency)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="w-10 text-right text-xs font-mono">{pct}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
