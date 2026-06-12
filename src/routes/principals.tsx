import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Mail } from "lucide-react";
import { principals } from "@/lib/mock-data";

export const Route = createFileRoute("/principals")({
  head: () => ({ meta: [{ title: "Principal Tracker — Rawji IFEAT 2026" }] }),
  component: PrincipalsPage,
});

const priorityColor = {
  A: "bg-[var(--gold)]/20 text-amber-700 border-amber-500/30",
  B: "bg-primary/15 text-primary border-primary/30",
  C: "bg-muted text-muted-foreground border-border",
};
const statusColor: Record<string, string> = {
  Identified: "bg-muted text-muted-foreground",
  Contacted: "bg-blue-100 text-blue-800",
  Responded: "bg-indigo-100 text-indigo-800",
  "Meeting Set": "bg-violet-100 text-violet-800",
  Met: "bg-cyan-100 text-cyan-800",
  Negotiation: "bg-amber-100 text-amber-800",
  Won: "bg-success/20 text-success",
  Lost: "bg-destructive/15 text-destructive",
};

function PrincipalsPage() {
  const tierCounts = { A: 0, B: 0, C: 0 } as Record<string, number>;
  principals.forEach((p) => (tierCounts[p.priority] = (tierCounts[p.priority] ?? 0) + 1));

  return (
    <div className="space-y-6">
      <PageHeader
        module="Module 2"
        title="Principal Tracker"
        description="Identified manufacturers and brand owners targeted for distributorship and direct supply."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 h-4 w-4" />Filter</Button>
            <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add principal</Button>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Total principals", value: principals.length, sub: "across 6 regions" },
          { label: "Tier A", value: tierCounts.A, sub: "high-priority targets" },
          { label: "Tier B", value: tierCounts.B, sub: "secondary targets" },
          { label: "Tier C", value: tierCounts.C, sub: "exploratory" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search company, contact, country..." className="pl-9" />
          </div>
          <Badge variant="outline" className="font-mono">{principals.length} records</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Company</th>
                <th className="font-medium">Country</th>
                <th className="font-medium">Category</th>
                <th className="font-medium">Contact</th>
                <th className="font-medium">Tier</th>
                <th className="font-medium">Status</th>
                <th className="font-medium">Score</th>
                <th className="font-medium">Meeting</th>
                <th className="px-4 font-medium">Owner</th>
              </tr>
            </thead>
            <tbody>
              {principals.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.company}</div>
                    <div className="text-xs text-muted-foreground">{p.id}</div>
                  </td>
                  <td>
                    <div>{p.country}</div>
                    <div className="text-xs text-muted-foreground">{p.region}</div>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {p.contact.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs">{p.contact}</div>
                        <a href={`mailto:${p.email}`} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary">
                          <Mail className="h-3 w-3" />{p.email}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${priorityColor[p.priority]}`}>
                      {p.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--gold)]" style={{ width: `${p.score}%` }} />
                      </div>
                      <span className="text-xs font-mono">{p.score}</span>
                    </div>
                  </td>
                  <td className="text-xs text-muted-foreground">{p.meetingDate ?? "—"}</td>
                  <td className="px-4 text-xs">{p.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
