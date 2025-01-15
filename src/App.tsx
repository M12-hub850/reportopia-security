import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import CarHandovers from "@/pages/CarHandovers";
import SignUp from "@/pages/SignUp";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/car-handovers" element={<CarHandovers />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;