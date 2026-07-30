import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, MapPin, Clock } from "lucide-react";
import { type Meeting } from "@/lib/mock-data";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { RowActions } from "@/components/row-actions";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Planner — Rawji IFEAT 2026" }] }),
  component: () => <MeetingsPage type="sales" />,
});

export function MeetingsPage({ type }: { type: "sales" | "purchase" }) {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["meetings", type],
    queryFn: () => apiFetch<Meeting[]>(`/api/meetings?type=${type}`),
  });
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Meeting | null>(null);

  const addMutation = useMutation({
    mutationFn: (m: Omit<Meeting, "id">) =>
      apiFetch<Meeting>("/api/meetings", { method: "POST", body: JSON.stringify({ ...m, type }) }),
    onSuccess: (m) => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast.success("Meeting scheduled", { description: `${m.company} · ${m.date} ${m.time}` });
      setOpen(false);
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Failed to schedule meeting"),
  });

  const editMutation = useMutation({
    mutationFn: (m: Meeting) =>
      apiFetch<Meeting>(`/api/meetings/${m.id}`, { method: "PATCH", body: JSON.stringify(m) }),
    onSuccess: (m) => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast.success("Meeting updated", { description: `${m.company} · ${m.date} ${m.time}` });
      setEditingItem(null);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update meeting"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/meetings/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast.success("Meeting removed");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete meeting"),
  });

  const byDate = items.reduce<Record<string, Meeting[]>>((a, m) => {
    (a[m.date] ??= []).push(m);
    return a;
  }, {});
  const days = Object.keys(byDate).sort();

  return (
    <div className="space-y-6">
      <PageHeader
        module={type === "purchase" ? "Purchase Module 1" : "Module 4"}
        title="Meeting Planner"
        description={
          type === "purchase"
            ? "On-floor supplier meetings for IFEAT 2026 Bangkok, Oct 4–8. Bookings, objectives and follow-ups."
            : "On-floor schedule for IFEAT 2026 Bangkok, Oct 4–8. Bookings, objectives and follow-ups."
        }
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Schedule meeting
              </Button>
            </DialogTrigger>
            <ScheduleMeetingForm onSubmit={(m) => addMutation.mutate(m)} />
          </Dialog>
        }
      />

      <Dialog open={!!editingItem} onOpenChange={(o) => !o && setEditingItem(null)}>
        {editingItem && (
          <ScheduleMeetingForm
            initial={editingItem}
            onSubmit={(m) => editMutation.mutate({ ...m, id: editingItem.id })}
          />
        )}
      </Dialog>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total meetings", value: items.length },
          { label: "Confirmed", value: items.length, accent: "text-success" },
          { label: "Conducted", value: items.filter((m) => m.outcome).length },
          {
            label: "Tier A",
            value: items.filter((m) => m.priority === "A").length,
            accent: "text-[var(--gold)]",
          },
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

      <div className="space-y-6">
        {days.map((d) => (
          <div key={d}>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <div className="text-[10px] uppercase opacity-80">
                  {new Date(d).toLocaleDateString("en", { month: "short" })}
                </div>
                <div className="text-lg font-bold leading-none">{new Date(d).getDate()}</div>
              </div>
              <div>
                <div className="font-semibold">
                  {new Date(d).toLocaleDateString("en", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {byDate[d].length} meetings · IMPACT Forum, Bangkok
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {byDate[d].map((m) => (
                <Card
                  key={m.id}
                  className="border-l-4"
                  style={{
                    borderLeftColor:
                      m.priority === "A"
                        ? "var(--gold)"
                        : m.priority === "B"
                          ? "var(--chart-1)"
                          : "var(--border)",
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {m.time}
                        </div>
                        <div className="mt-1 text-base font-semibold">{m.company}</div>
                        <div className="text-xs text-muted-foreground">w/ {m.attendee}</div>
                        <p className="mt-2 text-sm">{m.objective}</p>
                        {m.outcome && (
                          <div className="mt-3 rounded-md bg-success/10 px-2.5 py-1.5 text-xs text-success">
                            <span className="font-semibold">Outcome:</span> {m.outcome}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="font-mono">
                          Tier {m.priority}
                        </Badge>
                        <RowActions
                          itemLabel={`meeting with ${m.company}`}
                          onEdit={() => setEditingItem(m)}
                          deleting={deleteMutation.isPending}
                          onDelete={() => deleteMutation.mutate(m.id)}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                      <span>
                        Owner: <span className="font-medium text-foreground">{m.owner}</span>
                      </span>
                      {m.followUp && (
                        <span>
                          Follow-up:{" "}
                          <span className="font-medium text-foreground">{m.followUp}</span>
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleMeetingForm({
  onSubmit,
  initial,
}: {
  onSubmit: (m: Omit<Meeting, "id">) => void;
  initial?: Meeting;
}) {
  const [form, setForm] = useState<Omit<Meeting, "id">>(
    initial ?? {
      date: "2026-10-06",
      time: "10:00",
      company: "",
      attendee: "",
      objective: "",
      owner: "A. Rawji",
      priority: "A",
    },
  );
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{initial ? "Edit meeting" : "Schedule a meeting"}</DialogTitle>
        <DialogDescription>
          {initial
            ? "Update this meeting's details."
            : "Book a slot on the IFEAT 2026 Bangkok floor."}
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
          <Field label="Attendee">
            <Input
              value={form.attendee}
              onChange={(e) => setForm({ ...form, attendee: e.target.value })}
              placeholder="Élise Martin"
            />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Date">
            <Select value={form.date} onValueChange={(v) => setForm({ ...form, date: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08"].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Time">
            <Input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </Field>
          <Field label="Tier">
            <Select
              value={form.priority}
              onValueChange={(v) => setForm({ ...form, priority: v as Meeting["priority"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["A", "B", "C"].map((p) => (
                  <SelectItem key={p} value={p}>
                    Tier {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Objective">
          <Textarea
            rows={3}
            value={form.objective}
            onChange={(e) => setForm({ ...form, objective: e.target.value })}
            placeholder="Discuss naturals portfolio expansion in South Asia"
          />
        </Field>
        <Field label="Owner">
          <Input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
        </Field>
      </div>
      <DialogFooter>
        <Button
          onClick={() => {
            if (!form.company || !form.attendee)
              return toast.error("Company and attendee are required");
            onSubmit(form);
          }}
        >
          {initial ? "Save changes" : "Schedule meeting"}
        </Button>
      </DialogFooter>
    </DialogContent>
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
