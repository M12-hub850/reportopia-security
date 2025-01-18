import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/types/carHandover";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface VehicleContentsProps {
  form: UseFormReturn<FormSchema>;
}

export function VehicleContents({ form }: VehicleContentsProps) {
  const showOtherSpecification = form.watch("contents.other");
  const { language } = useLanguage();
  const t = translations[language].reports.vehicles.contents;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">{t.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contents.spareTire"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t.spareTire}</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.jackHandle"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t.jackHandle}</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.safetyKit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t.safetyKit}</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.fireExtinguisher"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t.fireExtinguisher}</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.dashCam"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t.dashCam}</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.other"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t.other}</FormLabel>
            </FormItem>
          )}
        />
      </div>

      {showOtherSpecification && (
        <div className="mt-4">
          <FormField
            control={form.control}
            name="contents.otherSpecification"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t.otherSpecificationPlaceholder}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </Card>
  );
}