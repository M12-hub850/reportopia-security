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
    // Get initial language preference from Supabase
    const fetchLanguagePreference = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('preferred_language')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setLanguageState(data.preferred_language as "en" | "ar");
        }
      }
    };

    fetchLanguagePreference();
  }, []);

  const setLanguage = async (newLang: "en" | "ar") => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_language: newLang })
        .eq('id', session.user.id);

      if (!error) {
        setLanguageState(newLang);
        // Update document direction based on language
        document.dir = newLang === "ar" ? "rtl" : "ltr";
      } else {
        console.error("Error updating language preference:", error);
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