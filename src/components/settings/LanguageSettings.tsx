import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/translations";

export function LanguageSettings() {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const t = translations[language].common;

  const handleLanguageChange = async (lang: "en" | "ar") => {
    try {
      await setLanguage(lang);
      toast({
        title: t.success,
        description: lang === "en" 
          ? "The application language has been changed to English"
          : "تم تغيير لغة التطبيق إلى العربية",
      });
    } catch (error) {
      console.error("Error changing language:", error);
      toast({
        title: t.error,
        description: t.languageUpdateError,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t.language}
        </CardTitle>
        <CardDescription>
          {t.languageDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {language === "en" ? "English" : "العربية"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}