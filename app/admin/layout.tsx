import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = cookies().get("user_session");

    if (!session) {
        redirect("/admin/login");
    }

    try {
        const user = JSON.parse(session.value);
        if (user.role !== "ADMIN") {
            redirect("/");
        }
    } catch (e) {
        redirect("/admin/login");
    }

    return (
        <div className="flex h-screen bg-black text-white">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
