import { BackButton } from "@/components/BackButton";
import { VehicleHandoverSection } from "@/components/VehicleHandoverSection";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

const NewVehicleHandover = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].reports.vehicles;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <BackButton />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <VehicleHandoverSection onClose={() => navigate("/reports")} />
      </div>
    </div>
  );
};

export default NewVehicleHandover;