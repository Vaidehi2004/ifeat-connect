import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Mail, Linkedin, MessageCircle, Phone, Plus } from "lucide-react";
import { type Outreach } from "@/lib/mock-data";
import { apiFetch } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";
import { RowActions } from "@/components/row-actions";

export const Route = createFileRoute("/outreach")({
  head: () => ({ meta: [{ title: "Outreach Tracker — Rawji IFEAT 2026" }] }),
  component: () => <OutreachPage type="sales" />,
});

const channelIcon = { Email: Mail, LinkedIn: Linkedin, WhatsApp: MessageCircle, Phone };
const outcomeColor: Record<string, string> = {
  Sent: "bg-muted text-muted-foreground",
  Opened: "bg-blue-100 text-blue-800",
  Replied: "bg-violet-100 text-violet-800",
  "Meeting Booked": "bg-success/20 text-success",
  "No Response": "bg-destructive/10 text-destructive",
};

export function OutreachPage({ type }: { type: "sales" | "purchase" }) {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["outreach", type],
    queryFn: () => apiFetch<Outreach[]>(`/api/outreach?type=${type}`),
  });
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Outreach | null>(null);

  const byCh = items.reduce<Record<string, number>>(
    (a, o) => ((a[o.channel] = (a[o.channel] ?? 0) + 1), a),
    {},
  );
  const chData = Object.entries(byCh).map(([channel, count]) => ({ channel, count }));
  const responseRate = Math.round(
    (items.filter((o) => o.outcome === "Replied" || o.outcome === "Meeting Booked").length /
      Math.max(items.length, 1)) *
      100,
  );

  const addMutation = useMutation({
    mutationFn: (o: Omit<Outreach, "id">) =>
      apiFetch<Outreach>("/api/outreach", { method: "POST", body: JSON.stringify({ ...o, type }) }),
    onSuccess: (o) => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      toast.success("Outreach logged", { description: `${o.channel} → ${o.company}` });
      setOpen(false);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to log outreach"),
  });

  const editMutation = useMutation({
    mutationFn: (o: Outreach) =>
      apiFetch<Outreach>(`/api/outreach/${o.id}`, { method: "PATCH", body: JSON.stringify(o) }),
    onSuccess: (o) => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      toast.success("Outreach updated", { description: `${o.channel} → ${o.company}` });
      setEditingItem(null);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update outreach"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/outreach/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      toast.success("Outreach removed");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete outreach"),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        module={type === "purchase" ? "Purchase Module 2" : "Module 3"}
        title="Outreach Tracker"
        description={
          type === "purchase"
            ? "Every supplier touchpoint across email, LinkedIn, WhatsApp and phone, by campaign."
            : "Every touchpoint across email, LinkedIn, WhatsApp and phone, by campaign."
        }
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Log outreach
              </Button>
            </DialogTrigger>
            <LogOutreachForm onSubmit={(o) => addMutation.mutate(o)} />
          </Dialog>
        }
      />

      <Dialog open={!!editingItem} onOpenChange={(o) => !o && setEditingItem(null)}>
        {editingItem && (
          <LogOutreachForm
            initial={editingItem}
            onSubmit={(o) => editMutation.mutate({ ...o, id: editingItem.id })}
          />
        )}
      </Dialog>

      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Total touchpoints", value: items.length },
          { label: "Response rate", value: `${responseRate}%`, accent: "text-success" },
          {
            label: "Meetings booked",
            value: items.filter((o) => o.outcome === "Meeting Booked").length,
            accent: "text-[var(--gold)]",
          },
          { label: "Active campaigns", value: new Set(items.map((o) => o.campaign)).size },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className={`mt-1 text-2xl font-semibold ${s.accent ?? ""}`}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
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
                    <th className="px-4 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((o) => {
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
                            <Icon className="h-3.5 w-3.5" />
                            {o.channel}
                          </div>
                        </td>
                        <td className="text-xs">{o.campaign}</td>
                        <td className="px-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${outcomeColor[o.outcome]}`}
                          >
                            {o.outcome}
                          </span>
                        </td>
                        <td className="px-4 text-right">
                          <RowActions
                            itemLabel={`${o.company} outreach`}
                            onEdit={() => setEditingItem(o)}
                            deleting={deleteMutation.isPending}
                            onDelete={() => deleteMutation.mutate(o.id)}
                          />
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
          <CardHeader>
            <CardTitle className="text-base">Channel mix</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={chData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="channel" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Array.from(new Set(items.map((o) => o.campaign))).map((c) => (
                <Badge key={c} variant="outline" className="text-[10px]">
                  {c}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
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

function LogOutreachForm({
  onSubmit,
  initial,
}: {
  onSubmit: (o: Omit<Outreach, "id">) => void;
  initial?: Outreach;
}) {
  const [form, setForm] = useState<Omit<Outreach, "id">>(
    initial ?? {
      date: new Date().toISOString().slice(0, 10),
      company: "",
      contact: "",
      channel: "Email",
      campaign: "Tier A Intro",
      outcome: "Sent",
    },
  );
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{initial ? "Edit outreach" : "Log outreach"}</DialogTitle>
        <DialogDescription>
          {initial
            ? "Update this touchpoint's details."
            : "Record an email, LinkedIn, WhatsApp or phone touchpoint."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Company">
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Robertet SA"
            />
          </Field>
          <Field label="Contact">
            <Input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="Élise Martin"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <DatePicker value={form.date} onChange={(date) => setForm({ ...form, date })} />
          </Field>
          <Field label="Channel">
            <Select
              value={form.channel}
              onValueChange={(v) => setForm({ ...form, channel: v as Outreach["channel"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Email", "LinkedIn", "WhatsApp", "Phone"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Campaign">
            <Input
              value={form.campaign}
              onChange={(e) => setForm({ ...form, campaign: e.target.value })}
            />
          </Field>
          <Field label="Outcome">
            <Select
              value={form.outcome}
              onValueChange={(v) => setForm({ ...form, outcome: v as Outreach["outcome"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Sent", "Opened", "Replied", "Meeting Booked", "No Response"].map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={() => {
            if (!form.company || !form.contact)
              return toast.error("Company and contact are required");
            onSubmit(form);
          }}
        >
          {initial ? "Save changes" : "Log outreach"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
