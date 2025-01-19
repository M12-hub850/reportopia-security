import { HelpCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export function SupportSettings() {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].common;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {t.helpAndSupport}
          </CardTitle>
          <CardDescription>
            {t.helpAndSupportDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowContactDialog(true)}
          >
            {t.contactSupport}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.contactSupport}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+966548431829" className="text-primary hover:underline">
                +966 54 843 1829
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:marwan.s@gfsp.com.sa" className="text-primary hover:underline">
                marwan.s@gfsp.com.sa
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}