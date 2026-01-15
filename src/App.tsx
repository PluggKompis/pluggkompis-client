import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { BackToTop } from "@/components/common";

// Pages
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { VenuesPage } from "@/pages/VenuesPage";
import { VenueDetailPage } from "@/pages/VenueDetailPage";
import { AboutPluggKompisPage } from "@/pages/AboutPluggKompisPage";
import { FaqPage } from "@/pages/FaqPage";

// Dashboard Pages (Protected - will add auth later)
import { ParentDashboard } from "@/pages/ParentDashboard";
import { StudentDashboard } from "@/pages/StudentDashboard";
import { VolunteerDashboard } from "@/pages/VolunteerDashboard";
import { CoordinatorDashboard } from "@/pages/CoordinatorDashboard";

// Development
import { ComponentShowcase } from "@/pages/ComponentShowcase";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/venues/:id" element={<VenueDetailPage />} />
            <Route path="/om-pluggkompis" element={<AboutPluggKompisPage />} />
            <Route path="/faq" element={<FaqPage />} />

            {/* Dashboard Routes (Will be protected later) */}
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/volunteer" element={<VolunteerDashboard />} />
            <Route path="/coordinator" element={<CoordinatorDashboard />} />

            {/* Development Route */}
            <Route path="/components" element={<ComponentShowcase />} />

            {/* Catch All - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
