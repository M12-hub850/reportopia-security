import { BackButton } from "@/components/BackButton";
import { VehicleHandoverSection } from "@/components/VehicleHandoverSection";
import { useNavigate } from "react-router-dom";

const NewVehicleHandover = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <BackButton />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">New Vehicle Handover</h1>
          <p className="text-muted-foreground">Document vehicle transfer and conditions</p>
        </div>
        <VehicleHandoverSection onClose={() => navigate("/reports")} />
      </div>
    </div>
  );
};

export default NewVehicleHandover;