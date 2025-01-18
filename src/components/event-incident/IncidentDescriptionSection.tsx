import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface IncidentDescriptionSectionProps {
  form: UseFormReturn<any>;
}

export function IncidentDescriptionSection({ form }: IncidentDescriptionSectionProps) {
  const { language } = useLanguage();
  const t = translations[language].reports.incidents;

  return (
    <div className="mt-4 space-y-4">
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
        name="actionTaken"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.actionTaken}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t.actionTakenPlaceholder}
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
        name="reportingPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.reportingPerson}</FormLabel>
            <FormControl>
              <Input placeholder={t.reportingPersonPlaceholder} {...field} />
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
                required={true}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}