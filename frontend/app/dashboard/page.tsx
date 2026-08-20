"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/customer");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#061A3A] text-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#4DA3FF]" />
        <p className="mt-4 text-sm text-white/50">
          Loading EstateFlow...
        </p>
      </div>
    </div>
  );
}