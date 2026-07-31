import { createFileRoute } from "@tanstack/react-router";
import { PipelinePage } from "./pipeline";

export const Route = createFileRoute("/purchase-pipeline")({
  head: () => ({ meta: [{ title: "Sourcing Pipeline — Rawji IFEAT 2026" }] }),
  component: () => <PipelinePage kind="purchase" />,
});
