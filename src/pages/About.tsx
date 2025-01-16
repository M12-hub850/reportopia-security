import { MainNav } from "@/components/MainNav";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MainNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About</h1>
          <p className="text-muted-foreground">Learn more about our security monitoring application.</p>
        </div>
      </div>
    </div>
  );
}