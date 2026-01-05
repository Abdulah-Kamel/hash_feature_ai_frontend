"use client";
import React, { useEffect } from "react";
import OverviewHero from "@/components/app/overview/OverviewHero";
import WorkspaceList from "@/components/app/overview/WorkspaceList";
import StreakCard from "@/components/app/overview/StreakCard";
import OverviewCalendar from "@/components/app/overview/OverviewCalendar";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
export default function OverviewPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);
  if (!loading && !isAuthenticated) {
    return null;
  }
  if (loading) {
    return (
      <section className="p-2 xl:p-10 max-sm:conatiner">
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-8" />
        </div>
      </section>
    );
  }
  return (
    <section className="p-2 py-6 xl:p-10 max-sm:conatiner">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <StreakCard />
          <div className="block xl:hidden">
            <OverviewCalendar />
          </div>
          <WorkspaceList />
        </div>
        <div className="xl:col-span-1 hidden xl:block">
          <div className="rounded-xl space-y-5">
            <OverviewCalendar />
          </div>
        </div>
      </div>
    </section>
  );
}
