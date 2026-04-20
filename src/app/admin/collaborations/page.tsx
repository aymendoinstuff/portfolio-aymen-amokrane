import { redirect } from "next/navigation";
export default function CollabRedirect() {
  redirect("/admin/inbox");
}
