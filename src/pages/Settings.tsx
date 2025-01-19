import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SupportSettings } from "@/components/settings/SupportSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export default function Settings() {
  const { language } = useLanguage();
  const t = translations[language].common;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir={language === "ar" ? "rtl" : "ltr"}>
      <MainNav />
      <div className="flex-1 max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{t.settings}</h1>
            <p className="text-muted-foreground">
              {t.settingsDescription}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <LanguageSettings />
          <NotificationSettings />
          <AccountSettings />
          <SupportSettings />
        </div>
      </div>
    </div>
  );
}