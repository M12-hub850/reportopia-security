import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import CarHandovers from "@/pages/CarHandovers";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/supervisor-reports" element={<Index />} />
          <Route path="/manager-reports" element={<Index />} />
          <Route path="/visitor-logs" element={<Index />} />
          <Route path="/car-handovers" element={<CarHandovers />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;