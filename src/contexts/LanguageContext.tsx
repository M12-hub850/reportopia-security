import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type LanguageContextType = {
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<"en" | "ar">("en");

  useEffect(() => {
    // Get initial language preference from Supabase and set direction
    const fetchLanguagePreference = async () => {
      console.log("LanguageContext: Fetching initial language preference");
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('preferred_language')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!error && data?.preferred_language) {
          console.log("LanguageContext: Setting initial language to", data.preferred_language);
          setLanguageState(data.preferred_language as "en" | "ar");
          // Set initial direction
          document.documentElement.dir = data.preferred_language === "ar" ? "rtl" : "ltr";
          document.documentElement.lang = data.preferred_language;
        }
      }
    };

    fetchLanguagePreference();
  }, []);

  // Update direction whenever language changes
  useEffect(() => {
    console.log("LanguageContext: Language changed to", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = async (newLang: "en" | "ar") => {
    console.log("LanguageContext: Setting language to", newLang);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_language: newLang })
        .eq('id', session.user.id);

      if (!error) {
        setLanguageState(newLang);
      } else {
        console.error("LanguageContext: Error updating language preference:", error);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}