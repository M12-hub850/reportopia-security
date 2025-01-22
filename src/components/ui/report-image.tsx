import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ReportImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ReportImage({ src, alt, className = "" }: ReportImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
        onClick={() => setIsOpen(true)}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-contain max-h-[80vh]"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}