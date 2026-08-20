"use client";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

type UserRole = "admin" | "owner" | "agent" | "customer";

type LoginUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type LoginResponse = {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://estate-flow-bj2z.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data: LoginResponse | {
        detail?: string;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          ("detail" in data && data.detail) ||
            ("message" in data && data.message) ||
            "Invalid email or password"
        );
      }

      if (!("access_token" in data) || !data.access_token) {
        throw new Error(
          "Login successful, but access token was not received."
        );
      }

      if (!("user" in data) || !data.user) {
        throw new Error(
          "Login successful, but user information was not received."
        );
      }

      const backendRole = String(data.user.role || "")
        .trim()
        .toUpperCase();

      const roleMap: Record<string, UserRole> = {
        ADMIN: "admin",
        OWNER: "owner",
        AGENT: "agent",
        CUSTOMER: "customer",
      };

      const userRole = roleMap[backendRole];

      if (!userRole) {
        throw new Error(
          `Your account does not have a valid user role. Received: ${
            backendRole || "none"
          }`
        );
      }

      const user: LoginUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: userRole,
      };

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setSuccess("Login successful!");

      const dashboardPaths: Record<UserRole, string> = {
        admin: "/dashboard/admin",
        owner: "/dashboard/owner",
        agent: "/dashboard/agent",
        customer: "/dashboard/customer",
      };

      const dashboardPath = dashboardPaths[userRole];

      window.location.replace(dashboardPath);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#061A3A] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#061A3A]">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-[#0B63F6]/20 blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#2F8CFF]/15 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B63F6]/[0.06] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 bg-[#03132B]/20" />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2F8CFF]/80 bg-[#061A3A]/70 shadow-lg shadow-[#0B63F6]/10 backdrop-blur-md transition-all duration-300 group-hover:border-[#4DA3FF]">
            <div className="h-4 w-4 rotate-45 border border-[#4DA3FF]" />
          </div>

          <span className="text-xl font-semibold tracking-tight text-white">
            Estate
            <span className="text-[#4DA3FF]">Flow</span>
          </span>
        </Link>

        <Link
          href="/"
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#BFD0E6] transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 flex min-h-[calc(100dvh-88px)] items-center justify-center px-6 py-10 sm:py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2F8CFF]/30 bg-[#0B2148]/80 shadow-xl shadow-[#0B63F6]/10 backdrop-blur-md">
              <Lock className="h-7 w-7 text-[#4DA3FF]" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#BFD0E6]/70">
              Sign in to continue managing your real estate workspace.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0B2148]/65 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-sm font-semibold text-white/85"
                >
                  Email address
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
                    <Mail className="h-5 w-5 text-[#4DA3FF]" />
                  </div>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-14 w-full rounded-xl border border-white/10 bg-[#061A3A]/80 pl-12 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/25 hover:border-white/20 focus:border-[#2F8CFF]/70 focus:bg-[#061A3A] focus:ring-2 focus:ring-[#2F8CFF]/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-white/85"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#4DA3FF] transition-colors duration-200 hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
                    <Lock className="h-5 w-5 text-[#4DA3FF]" />
                  </div>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-14 w-full rounded-xl border border-white/10 bg-[#061A3A]/80 pl-12 pr-12 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/25 hover:border-white/20 focus:border-[#2F8CFF]/70 focus:bg-[#061A3A] focus:ring-2 focus:ring-[#2F8CFF]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-white/35 transition-colors duration-200 hover:text-[#4DA3FF]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm leading-5 text-green-300">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B63F6] via-[#2F8CFF] to-[#1683FF] px-6 text-sm font-bold text-white shadow-lg shadow-[#0B63F6]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0B63F6]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-[#BFD0E6]/60">
                Don't have an EstateFlow account?
              </p>

              <Link
                href="/register"
                className="mt-2 inline-flex text-sm font-semibold text-[#4DA3FF] transition-colors duration-200 hover:text-white"
              >
                Create an account
              </Link>
            </div>
          </div>

          <p className="mt-6 pb-4 text-center text-xs text-[#BFD0E6]/35">
            EstateFlow · Modern Real Estate Management
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-[60%] -translate-x-1/2 rounded-full bg-[#2F8CFF]/10 blur-3xl" />
    </main>
  );
}