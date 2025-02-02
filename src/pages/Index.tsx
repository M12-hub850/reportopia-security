import { MainNav } from "@/components/MainNav";
import { SparklesCore } from "@/components/ui/sparkles";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { DashboardStats } from "@/components/DashboardStats";

export default function Index() {
  const { language } = useLanguage();
  const t = translations[language].dashboard;

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Sparkles Background */}
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
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            {t.welcome}
          </h1>
          
          <div className="mt-8">
            <DashboardStats />
          </div>
        </div>
      </main>
    </div>
  );
}