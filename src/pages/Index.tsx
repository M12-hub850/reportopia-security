
import { MainNav } from "@/components/MainNav";
import { SparklesCore } from "@/components/ui/sparkles";
import { AuthCheck } from "@/components/AuthCheck";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardContent } from "@/components/DashboardContent";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AuthCheck />
      <MainNav />
      
      <div className="fixed inset-0 -z-10">
        <SparklesCore
          id="dashboard-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="hsl(var(--primary))"
          speed={0.5}
        />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="relative z-10 space-y-8">
          <DashboardHeader />
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}
