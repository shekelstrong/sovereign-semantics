import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  description: "Внутренняя панель управления.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/admin" },
};

export default function AdminPage() {
  return <AdminPanel />;
}
