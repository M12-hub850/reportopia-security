import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { ReportCard } from "@/components/ReportCard";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FileTextIcon } from "lucide-react";
import { MainNav } from "@/components/MainNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

const Index = () => {
  const navigate = useNavigate();
  const form = useForm();
  const { language } = useLanguage();
  const t = translations[language].dashboard;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.log("No active session, redirecting to sign-in");
        navigate("/sign-in");
        return;
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        console.log("Auth state changed: signed out");
        navigate("/sign-in");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Form {...form}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <MainNav />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            <DashboardStats />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <ReportCard
                title={t.cards.managerVisits.title}
                subtitle={t.cards.managerVisits.subtitle}
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t.cards.managerVisits.description}
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/manager-reports">{t.cards.managerVisits.action}</Link>
                  </Button>
                </div>
              </ReportCard>

              <ReportCard
                title={t.cards.supervisorVisits.title}
                subtitle={t.cards.supervisorVisits.subtitle}
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t.cards.supervisorVisits.description}
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/supervisor-reports">{t.cards.supervisorVisits.action}</Link>
                  </Button>
                </div>
              </ReportCard>

              <ReportCard
                title={t.cards.incidents.title}
                subtitle={t.cards.incidents.subtitle}
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t.cards.incidents.description}
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/event-incidents">{t.cards.incidents.action}</Link>
                  </Button>
                </div>
              </ReportCard>

              <ReportCard
                title={t.cards.vehicles.title}
                subtitle={t.cards.vehicles.subtitle}
              >
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t.cards.vehicles.description}
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/car-handovers/new">{t.cards.vehicles.action}</Link>
                  </Button>
                </div>
              </ReportCard>

              <ReportCard
                title={t.cards.archive.title}
                subtitle={t.cards.archive.subtitle}
                className="md:col-span-2 lg:col-span-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t.cards.archive.description}
                  </p>
                  <Button asChild>
                    <Link to="/reports">
                      <FileTextIcon className="h-4 w-4 mr-2" />
                      {t.cards.archive.action}
                    </Link>
                  </Button>
                </div>
              </ReportCard>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default Index;