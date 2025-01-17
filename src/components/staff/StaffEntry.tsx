import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { StaffEntryBasicFields } from "./StaffEntryBasicFields";
import { StaffEntryRatings } from "./StaffEntryRatings";

interface StaffEntryProps {
  form: UseFormReturn<any>;
  index: number;
  onRemove: () => void;
}

export function StaffEntry({ form, index, onRemove }: StaffEntryProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-medium">Staff Entry #{index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StaffEntryBasicFields form={form} index={index} />
        <StaffEntryRatings form={form} index={index} />
      </div>
    </Card>
  );
}