import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ManagerReports from "./pages/ManagerReports";
import SupervisorReports from "./pages/SupervisorReports";
import EventIncidents from "./pages/EventIncidents";
import NewVehicleHandover from "./pages/NewVehicleHandover";
import ReportView from "./pages/ReportView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/manager-reports" element={<ManagerReports />} />
        <Route path="/supervisor-reports" element={<SupervisorReports />} />
        <Route path="/event-incidents" element={<EventIncidents />} />
        <Route path="/car-handovers/new" element={<NewVehicleHandover />} />
        <Route path="/reports" element={<ReportView />} />
      </Routes>
    </Router>
  );
}

export default App;