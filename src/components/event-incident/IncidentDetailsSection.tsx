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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface IncidentDetailsSectionProps {
  form: UseFormReturn<any>;
}

export function IncidentDetailsSection({ form }: IncidentDetailsSectionProps) {
  const { language } = useLanguage();
  const t = translations[language].reports.incidents;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">{t.incidentDetails}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          name="incidentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t.date}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{t.pickDate}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reportingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.reportingTime}</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder={t.timePlaceholder}
                  {...field}
                  onChange={(e) => {
                    const timeValue = e.target.value;
                    const [hours, minutes] = timeValue.split(':');
                    const date = new Date();
                    date.setHours(parseInt(hours), parseInt(minutes));
                    field.onChange(date);
                  }}
                  value={field.value ? format(field.value, "HH:mm") : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}