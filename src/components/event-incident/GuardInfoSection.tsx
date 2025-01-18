import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface GuardInfoSectionProps {
  form: UseFormReturn<any>;
}

export function GuardInfoSection({ form }: GuardInfoSectionProps) {
  const { language } = useLanguage();
  const t = translations[language].reports.incidents;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">{t.guardInfo}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="guardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.guardName}</FormLabel>
              <FormControl>
                <Input placeholder={t.guardNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.shift}</FormLabel>
              <FormControl>
                <Input placeholder={t.shiftPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}