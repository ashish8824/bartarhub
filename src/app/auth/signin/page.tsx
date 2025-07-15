"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) toast.error(error.message);
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient p-4">
      <div className="relative w-full max-w-md bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
        <h2 className="flex items-center justify-center text-3xl font-bold text-indigo-800 mb-6">
          <LogIn className="mr-2" /> Sign In
        </h2>

        <div className="mb-4 relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition duration-300 disabled:opacity-50"
        >
          {loading ? "Signing In…" : "Sign In"}
        </button>

        <div className="mt-4 flex justify-between text-sm text-gray-700">
          <Link href="/auth/signup" className="hover:underline text-indigo-600">
            Don’t have an account?
          </Link>
          <Link
            href="/auth/forgot-password"
            className="hover:underline text-indigo-600"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
