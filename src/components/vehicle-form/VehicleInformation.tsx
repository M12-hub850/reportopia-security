
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/types/carHandover";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Switch } from "@/components/ui/switch";

interface VehicleInformationProps {
  form: UseFormReturn<FormSchema>;
}

export function VehicleInformation({ form }: VehicleInformationProps) {
  const { language } = useLanguage();
  const t = translations[language].reports.vehicles;

  const isDelegated = form.watch("isDelegated");

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">{t.vehicleInfo}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="plateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.plateNumber}</FormLabel>
              <FormControl>
                <Input placeholder={t.plateNumberPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.model}</FormLabel>
              <FormControl>
                <Input placeholder={t.modelPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.type}</FormLabel>
              <FormControl>
                <Input placeholder={t.typePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.brand}</FormLabel>
              <FormControl>
                <Input placeholder={t.brandPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.mileage}</FormLabel>
              <FormControl>
                <Input type="number" placeholder={t.mileagePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.location}</FormLabel>
              <FormControl>
                <Input placeholder={t.locationPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDelegated"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Delegated</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isDelegated ? (
          <FormField
            control={form.control}
            name="delegationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delegation Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter delegation number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="nonDelegationReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for No Delegation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter reason" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </Card>
  );
}
