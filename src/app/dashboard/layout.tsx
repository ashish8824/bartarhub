// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixed on left */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-screen z-30">
        <Sidebar />
      </div>

      {/* Main section with topbar and scrollable content */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Topbar fixed on top */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <Topbar />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
