
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export function DashboardHeader() {
  const { language } = useLanguage();
  const t = translations[language].dashboard;

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
        {t.welcome}
      </h1>
    </div>
  );
}
