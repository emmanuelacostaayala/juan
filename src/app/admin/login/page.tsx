import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminLoginForm from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");
  return <AdminLoginForm />;
}
