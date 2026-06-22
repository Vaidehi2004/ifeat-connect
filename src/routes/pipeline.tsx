import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { opportunities as seed, type Opportunity } from "@/lib/mock-data";
import { toast } from "sonner";

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
  const [items, setItems] = useState<Opportunity[]>(seed);
  const [open, setOpen] = useState(false);

  const totalRev = items.reduce((s, o) => s + o.revenue, 0);
  const weighted = items.reduce((s, o) => s + o.revenue * o.probability, 0);
  const won = items.filter((o) => o.stage === "Closed Won").reduce((s, o) => s + o.revenue, 0);

  function handleAdd(o: Opportunity) {
    setItems((arr) => [...arr, o]);
    toast.success("Opportunity added", { description: `${o.company} · $${(o.revenue / 1000).toFixed(0)}k` });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        module="Module 5"
        title="Opportunity Pipeline"
        description="Distribution, direct manufacturing, JV and toll opportunities — weighted by stage probability."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add opportunity</Button>
            </DialogTrigger>
            <AddOpportunityForm nextId={`OPP-${String(items.length + 1).padStart(3, "0")}`} onSubmit={handleAdd} />
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total pipeline", value: `$${(totalRev / 1000).toFixed(0)}k` },
          { label: "Weighted", value: `$${(weighted / 1000).toFixed(0)}k`, accent: "text-[var(--gold)]" },
          { label: "Closed Won", value: `$${(won / 1000).toFixed(0)}k`, accent: "text-success" },
          { label: "Open deals", value: items.filter((o) => !o.stage.startsWith("Closed")).length },
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
          const stageItems = items.filter((o) => o.stage === stage);
          const sum = stageItems.reduce((s, o) => s + o.revenue, 0);
          return (
            <div key={stage} className="rounded-xl bg-muted/40 p-3">
              <div className="flex items-center justify-between px-1 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold">{stage}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">{stageItems.length}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">${(sum / 1000).toFixed(0)}k</span>
              </div>
              <div className="space-y-2">
                {stageItems.map((o) => (
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
                {stageItems.length === 0 && (
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function AddOpportunityForm({ nextId, onSubmit }: { nextId: string; onSubmit: (o: Opportunity) => void }) {
  const [form, setForm] = useState<Opportunity>({
    id: nextId, company: "", country: "", region: "Europe",
    type: "Distribution", revenue: 50000, probability: 0.3, stage: "Discovery",
  });
  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Add opportunity</DialogTitle>
        <DialogDescription>Create a new deal in the IFEAT 2026 pipeline.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Robertet SA" /></Field>
          <Field label="Type">
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Opportunity["type"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Distribution","Direct Manufacturing","Joint Venture","Toll Manufacturing"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Country"><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="France" /></Field>
          <Field label="Region">
            <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Europe","North America","South America","Asia Pacific","MENA","Africa"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Revenue (USD)"><Input type="number" min={0} step={1000} value={form.revenue} onChange={(e) => setForm({ ...form, revenue: Number(e.target.value) })} /></Field>
          <Field label="Probability">
            <Select value={String(form.probability)} onValueChange={(v) => setForm({ ...form, probability: Number(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[0.1,0.25,0.35,0.5,0.65,0.75,0.9].map((p) => <SelectItem key={p} value={String(p)}>{Math.round(p * 100)}%</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Stage">
            <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v as Opportunity["stage"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => {
          if (!form.company || !form.country) return toast.error("Company and country are required");
          onSubmit(form);
        }}>Add opportunity</Button>
      </DialogFooter>
    </DialogContent>
  );
}
