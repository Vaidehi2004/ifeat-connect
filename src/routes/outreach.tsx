import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, MessageCircle, Phone, Plus } from "lucide-react";
import { outreach } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/outreach")({
  head: () => ({ meta: [{ title: "Outreach Tracker — Rawji IFEAT 2026" }] }),
  component: OutreachPage,
});

const channelIcon = { Email: Mail, LinkedIn: Linkedin, WhatsApp: MessageCircle, Phone };
const outcomeColor: Record<string, string> = {
  Sent: "bg-muted text-muted-foreground",
  Opened: "bg-blue-100 text-blue-800",
  Replied: "bg-violet-100 text-violet-800",
  "Meeting Booked": "bg-success/20 text-success",
  "No Response": "bg-destructive/10 text-destructive",
};

function OutreachPage() {
  const byCh = outreach.reduce<Record<string, number>>((a, o) => ((a[o.channel] = (a[o.channel] ?? 0) + 1), a), {});
  const chData = Object.entries(byCh).map(([channel, count]) => ({ channel, count }));
  const responseRate = Math.round((outreach.filter((o) => o.outcome === "Replied" || o.outcome === "Meeting Booked").length / outreach.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        module="Module 3"
        title="Outreach Tracker"
        description="Every touchpoint across email, LinkedIn, WhatsApp and phone, by campaign."
        actions={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Log outreach</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Total touchpoints", value: outreach.length },
          { label: "Response rate", value: `${responseRate}%`, accent: "text-success" },
          { label: "Meetings booked", value: outreach.filter((o) => o.outcome === "Meeting Booked").length, accent: "text-[var(--gold)]" },
          { label: "Active campaigns", value: new Set(outreach.map((o) => o.campaign)).size },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className={`mt-1 text-2xl font-semibold ${s.accent ?? ""}`}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Recent activity</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="font-medium">Company / Contact</th>
                    <th className="font-medium">Channel</th>
                    <th className="font-medium">Campaign</th>
                    <th className="px-4 font-medium">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {outreach.map((o) => {
                    const Icon = channelIcon[o.channel];
                    return (
                      <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono text-xs">{o.date}</td>
                        <td>
                          <div className="font-medium">{o.company}</div>
                          <div className="text-xs text-muted-foreground">{o.contact}</div>
                        </td>
                        <td>
                          <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs">
                            <Icon className="h-3.5 w-3.5" />{o.channel}
                          </div>
                        </td>
                        <td className="text-xs">{o.campaign}</td>
                        <td className="px-4">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${outcomeColor[o.outcome]}`}>
                            {o.outcome}
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

        <Card>
          <CardHeader><CardTitle className="text-base">Channel mix</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={chData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="channel" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Array.from(new Set(outreach.map((o) => o.campaign))).map((c) => (
                <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
