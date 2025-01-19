import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface PersonalInfoProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PersonalInfo({ formData, onChange }: PersonalInfoProps) {
  const { language } = useLanguage();
  const t = translations[language].common;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">{t.fullName}</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          placeholder={t.fullName}
        />
      </div>

      <div>
        <Label htmlFor="email">{t.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder={t.email}
          disabled
        />
      </div>

      <div>
        <Label htmlFor="phone">{t.phone}</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder={t.phone}
        />
      </div>
    </div>
  );
}