import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Login Admin",
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5">
      <p className="text-sm text-[#A99B9F]">Barokah Jaya Fashion</p>
      <h1 className="font-serif text-3xl">Login Admin</h1>
      <div className="mt-6 rounded-[16px] border border-[#EDE2E5] bg-white p-6">
        <LoginForm />
      </div>
    </main>
  );
}
