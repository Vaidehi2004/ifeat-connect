import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Mail } from "lucide-react";
import { principals as seed, type Principal } from "@/lib/mock-data";
import { toast } from "sonner";

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
  const [items, setItems] = useState<Principal[]>(seed);
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<"all" | "A" | "B" | "C">("all");
  const [q, setQ] = useState("");

  const filtered = items.filter((p) => {
    if (tier !== "all" && p.priority !== tier) return false;
    if (q && !`${p.company} ${p.contact} ${p.country}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const tierCounts = { A: 0, B: 0, C: 0 } as Record<string, number>;
  items.forEach((p) => (tierCounts[p.priority] = (tierCounts[p.priority] ?? 0) + 1));

  function handleAdd(p: Principal) {
    setItems((arr) => [p, ...arr]);
    toast.success("Principal added", { description: `${p.company} (${p.country})` });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        module="Module 2"
        title="Principal Tracker"
        description="Identified manufacturers and brand owners targeted for distributorship and direct supply."
        actions={
          <>
            <Select value={tier} onValueChange={(v) => setTier(v as typeof tier)}>
              <SelectTrigger className="h-9 w-[140px]">
                <Filter className="mr-1.5 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                <SelectItem value="A">Tier A</SelectItem>
                <SelectItem value="B">Tier B</SelectItem>
                <SelectItem value="C">Tier C</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add principal</Button>
              </DialogTrigger>
              <AddPrincipalForm nextId={`P-${String(items.length + 1).padStart(3, "0")}`} onSubmit={handleAdd} />
            </Dialog>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Total principals", value: items.length, sub: "across 6 regions" },
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
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company, contact, country..." className="pl-9" />
          </div>
          <Badge variant="outline" className="font-mono">{filtered.length} records</Badge>
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
              {filtered.map((p) => (
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
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">No principals match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function AddPrincipalForm({ nextId, onSubmit }: { nextId: string; onSubmit: (p: Principal) => void }) {
  const [form, setForm] = useState<Principal>({
    id: nextId, company: "", country: "", region: "Europe", category: "Naturals",
    contact: "", email: "", priority: "B", status: "Identified", score: 60, owner: "A. Rawji",
  });
  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Add principal</DialogTitle>
        <DialogDescription>Capture a new target manufacturer or brand owner.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Fragrances" /></Field>
          <Field label="Category">
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Naturals","Aroma Chemicals","Citrus","Botanicals","Flavors","Fragrance","Pine Chemicals","Carriers","Distribution"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Country"><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="France" /></Field>
          <Field label="Region">
            <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Europe","North America","South America","Asia Pacific","MENA","Africa"].map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Contact name"><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Jane Doe" /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@acme.com" /></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Tier">
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Principal["priority"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["A","B","C"].map((t) => <SelectItem key={t} value={t}>Tier {t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Score"><Input type="number" min={0} max={100} value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} /></Field>
          <Field label="Owner"><Input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></Field>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => {
          if (!form.company || !form.contact) return toast.error("Company and contact are required");
          onSubmit(form);
        }}>Add principal</Button>
      </DialogFooter>
    </DialogContent>
  );
}
