import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Clock } from "lucide-react";
import { meetings } from "@/lib/mock-data";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Planner — Rawji IFEAT 2026" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const byDate = meetings.reduce<Record<string, typeof meetings>>((a, m) => {
    (a[m.date] ??= []).push(m);
    return a;
  }, {});
  const days = Object.keys(byDate).sort();

  return (
    <div className="space-y-6">
      <PageHeader
        module="Module 4"
        title="Meeting Planner"
        description="On-floor schedule for IFEAT 2026 Bangkok, Oct 4–8. Bookings, objectives and follow-ups."
        actions={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Schedule meeting</Button>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total meetings", value: meetings.length },
          { label: "Confirmed", value: meetings.length, accent: "text-success" },
          { label: "Conducted", value: meetings.filter((m) => m.outcome).length },
          { label: "Tier A", value: meetings.filter((m) => m.priority === "A").length, accent: "text-[var(--gold)]" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
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
                <div className="text-[10px] uppercase opacity-80">{new Date(d).toLocaleDateString("en", { month: "short" })}</div>
                <div className="text-lg font-bold leading-none">{new Date(d).getDate()}</div>
              </div>
              <div>
                <div className="font-semibold">{new Date(d).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</div>
                <div className="text-xs text-muted-foreground">{byDate[d].length} meetings · IMPACT Forum, Bangkok</div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {byDate[d].map((m) => (
                <Card key={m.id} className="border-l-4" style={{ borderLeftColor: m.priority === "A" ? "var(--gold)" : m.priority === "B" ? "var(--chart-1)" : "var(--border)" }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />{m.time}
                          <span>·</span>
                          <MapPin className="h-3 w-3" />Booth A-12
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
                      <Badge variant="outline" className="font-mono">Tier {m.priority}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                      <span>Owner: <span className="font-medium text-foreground">{m.owner}</span></span>
                      {m.followUp && <span>Follow-up: <span className="font-medium text-foreground">{m.followUp}</span></span>}
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
