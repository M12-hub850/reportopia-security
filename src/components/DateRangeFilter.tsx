import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

interface DateRangeFilterProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangeFilter({ date, onDateChange }: DateRangeFilterProps) {
  const handleLastWeek = () => {
    const end = endOfDay(new Date());
    const start = startOfDay(addDays(end, -7));
    onDateChange({ from: start, to: end });
  };

  const handleLastMonth = () => {
    const end = endOfDay(new Date());
    const start = startOfDay(addDays(end, -30));
    onDateChange({ from: start, to: end });
  };

  const handleThisWeek = () => {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    onDateChange({ from: start, to: end });
  };

  const handleThisMonth = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    onDateChange({ from: start, to: end });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleThisWeek}>
          This Week
        </Button>
        <Button variant="outline" size="sm" onClick={handleLastWeek}>
          Last Week
        </Button>
        <Button variant="outline" size="sm" onClick={handleThisMonth}>
          This Month
        </Button>
        <Button variant="outline" size="sm" onClick={handleLastMonth}>
          Last Month
        </Button>
      </div>
      <DatePickerWithRange date={date} onDateChange={onDateChange} />
    </div>
  );
}