import { createFileRoute } from "@tanstack/react-router";
import { MeetingsPage } from "./meetings";

export const Route = createFileRoute("/purchase-meetings")({
  head: () => ({ meta: [{ title: "Meeting Planner (Purchase) — Rawji IFEAT 2026" }] }),
  component: () => <MeetingsPage type="purchase" />,
});
