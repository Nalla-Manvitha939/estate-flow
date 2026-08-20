"use client";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      setToken(urlToken);
    } else {
      setError("Invalid or missing password reset link.");
    }
  }, []);

  const handleResetPassword = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://estate-flow-bj2z.onrender.com/api/v1/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            new_password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to reset your password."
        );
      }

      setSuccess(
        "Your password has been reset successfully!"
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1800);
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
    <main className="relative min-h-screen overflow-hidden bg-[#061A3A] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-[#0B63F6]/20 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#2F8CFF]/15 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,99,246,0.12),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2F8CFF]/80 bg-[#061A3A]/60 backdrop-blur-sm">
            <div className="h-4 w-4 rotate-45 border border-[#4DA3FF]" />
          </div>

          <span className="text-xl font-semibold tracking-tight">
            Estate
            <span className="text-[#4DA3FF]">Flow</span>
          </span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 text-sm font-medium text-[#BFD0E6] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-90px)] items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2F8CFF]/30 bg-[#0B2148]/70 shadow-lg shadow-[#0B63F6]/10">
              <KeyRound className="h-6 w-6 text-[#4DA3FF]" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Reset your password
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Create a new secure password for your EstateFlow
              account.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <form
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  New password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4DA3FF]" />

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
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#061A3A]/70 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#2F8CFF]/70 focus:ring-2 focus:ring-[#2F8CFF]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white"
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

                <p className="mt-2 text-xs text-white/35">
                  Password must contain at least 8
                  characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4DA3FF]" />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#061A3A]/70 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#2F8CFF]/70 focus:ring-2 focus:ring-[#2F8CFF]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm leading-6 text-green-300">
                  {success}
                  <p className="mt-1 text-xs text-green-300/70">
                    Redirecting you to login...
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B63F6] via-[#2F8CFF] to-[#1683FF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0B63F6]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0B63F6]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Resetting password..."
                  : "Reset Password"}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-white/45">
                Remember your password?
              </p>

              <Link
                href="/login"
                className="mt-2 inline-flex text-sm font-semibold text-[#4DA3FF] transition hover:text-white"
              >
                Back to login
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/25">
            EstateFlow · Modern Real Estate Management
          </p>
        </div>
      </div>
    </main>
  );
}
