import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VenuesPage from "@/pages/VenuesPage";
import VenueDetailPage from "@/pages/VenueDetailPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import VolunteerDashboard from "@/pages/VolunteerDashboard";
import CoordinatorDashboard from "@/pages/CoordinatorDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Header will be added later */}
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4">
            <div className="text-2xl font-bold text-blue-600">PluggKompis</div>
          </nav>
        </header>

        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/venues/:id" element={<VenueDetailPage />} />

            {/* Routes that will be protected later */}
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/volunteer" element={<VolunteerDashboard />} />
            <Route path="/coordinator" element={<CoordinatorDashboard />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
