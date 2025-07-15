"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, UserPlus, Mail, Lock, User } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    setLoading(false);

    if (error) toast.error(error.message);
    else {
      toast.success("Sign‑up successful! Check your email to confirm.");
      router.push("/auth/signin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient p-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
        <h2 className="flex items-center justify-center text-3xl font-bold text-indigo-800 mb-6">
          <UserPlus className="mr-2" /> Create Account
        </h2>

        <div className="mb-4 relative">
          <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Username"
            className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6 relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-indigo-500"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition duration-300 disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin mr-2" size={18} />}
          Create Account
        </button>

        <p className="mt-6 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
