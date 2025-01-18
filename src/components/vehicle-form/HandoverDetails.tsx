import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/types/carHandover";
import { ImageUpload } from "@/components/ImageUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface HandoverDetailsProps {
  form: UseFormReturn<FormSchema>;
}

export function HandoverDetails({ form }: HandoverDetailsProps) {
  const { language } = useLanguage();
  const t = translations[language].reports.vehicles;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">{t.receiverInfo}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="receiverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.receiverName}</FormLabel>
              <FormControl>
                <Input placeholder={t.receiverNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.receiverPhone}</FormLabel>
              <FormControl>
                <Input placeholder={t.receiverPhonePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.receiverId}</FormLabel>
              <FormControl>
                <Input placeholder={t.receiverIdPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverIdImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.receiverIdImage}</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  bucket="vehicle_images"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="drivingLicenseImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.drivingLicenseImage}</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  bucket="vehicle_images"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supervisorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.supervisorName}</FormLabel>
              <FormControl>
                <Input placeholder={t.supervisorNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.date}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.time}</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}