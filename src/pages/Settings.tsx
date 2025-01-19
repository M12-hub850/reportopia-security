import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SupportSettings } from "@/components/settings/SupportSettings";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MainNav />
      <div className="flex-1 max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and application settings.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <LanguageSettings />
          <NotificationSettings />
          <AccountSettings />
          <SupportSettings />
        </div>
      </div>
    </div>
  );
}