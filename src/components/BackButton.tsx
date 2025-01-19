import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/")}
      aria-label="Back to Dashboard"
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
  );
};