import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";

export const Route = createFileRoute("/persona")({
  head: () => ({ meta: [{ title: "Applicant Profile — Bellcurve" }] }),
  component: () => <AppShell />,
});
