import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Redirect to the tours list page
  redirect("/admin/tours");
} 