import { redirect } from "next/navigation";
import { getServerSession } from "@/app/_lib/auth-server";
import { LoginForm } from "./_components/login-form";

export default async function AuthPage() {
  const session = await getServerSession();

  if (session) redirect("/");

  return <LoginForm />;
}
