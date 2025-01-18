import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MainNav />
      <BackButton />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Help & Support</h1>
          <p className="text-muted-foreground">Get help with using the application or contact support.</p>
        </div>
      </div>
    </div>
  );
}