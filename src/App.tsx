import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import CarHandovers from "@/pages/CarHandovers";
import VisitorLogs from "@/pages/VisitorLogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/car-handovers" element={<CarHandovers />} />
        <Route path="/visitor-logs" element={<VisitorLogs />} />
      </Routes>
    </Router>
  );
}

export default App;