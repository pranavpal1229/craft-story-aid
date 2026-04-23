import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";

export const Route = createFileRoute("/lesson")({
  head: () => ({ meta: [{ title: "DCF Lesson — Bellcurve" }] }),
  component: () => <AppShell />,
});
