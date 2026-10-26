import { redirect } from "next/navigation";

export default function LegacyDemoDataRedirect() {
  redirect("/admin/infrastructure");
}
