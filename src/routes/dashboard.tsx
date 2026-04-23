import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Bellcurve" }] }),
  component: () => <AppShell />,
});
