import { createFileRoute } from "@tanstack/react-router";
import { OutreachPage } from "./outreach";

export const Route = createFileRoute("/purchase-outreach")({
  head: () => ({ meta: [{ title: "Outreach Tracker (Purchase) — Rawji IFEAT 2026" }] }),
  component: () => <OutreachPage type="purchase" />,
});
