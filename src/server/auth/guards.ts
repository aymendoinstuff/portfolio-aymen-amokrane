import "server-only";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser, SessionUser } from "./server";

/** For Server Components / Server Actions */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    // Optional: preserve return path via middleware's `next` param instead
    redirect("/login?reason=auth");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.isAdmin) {
    // Choose one: 404 to avoid leaking existence, or a dedicated page
    notFound();
    // redirect("/not-authorized");
  }
  return user;
}
