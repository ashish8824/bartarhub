"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function Topbar() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userEmail = session?.user?.email || "";
      setEmail(userEmail);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  const initials = email ? email.charAt(0).toUpperCase() : "U";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <h1 className="text-xl font-semibold text-indigo-600">Welcome back 👋</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-800 hidden sm:block">{email}</div>
        <div className="relative group">
          <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold cursor-pointer">
            {initials}
          </div>
          <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md border opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-2" size={16} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
