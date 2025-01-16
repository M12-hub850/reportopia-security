import { MainNav } from "@/components/MainNav";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MainNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
        </div>
      </div>
    </div>
  );
}