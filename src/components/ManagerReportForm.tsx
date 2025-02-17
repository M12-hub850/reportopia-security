
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { StaffEntriesList } from "@/components/StaffEntriesList";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface ManagerReportFormProps {
  form: UseFormReturn<any>;
}

export function ManagerReportForm({ form }: ManagerReportFormProps) {
  const { language } = useLanguage();
  const t = translations[language].reports.manager;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">{t.staffAssessment}</h3>
        <StaffEntriesList form={form} maxEntries={8} />
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">{t.additionalInfo}</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.description}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t.descriptionPlaceholder}
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.photoEvidence}</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    bucket="report_photos"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  );
}
