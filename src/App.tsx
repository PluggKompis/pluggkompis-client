import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header, Footer } from "@/components/layout";
import { BackToTop } from "@/components/common";
import { UserRole } from "@/types";

// Pages
import { HomePage } from "@/pages/HomePage";
import { VenuesPage } from "@/pages/VenuesPage";
import { VenueDetailPage } from "@/pages/VenueDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { AboutPluggKompisPage } from "@/pages/AboutPluggKompisPage";
import { FaqPage } from "@/pages/FaqPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import { ComponentShowcase } from "@/pages/ComponentShowcase"; // Development deleete this later

// // Role-specific pages (Protected)
import { CoordinatorDashboard } from "@/pages/CoordinatorDashboard";
import { ParentDashboard } from "@/pages/ParentDashboard";
import { StudentDashboard } from "@/pages/StudentDashboard";
import { VolunteerDashboard } from "@/pages/VolunteerDashboard";
import { ProfilePage } from "@/pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/venues" element={<VenuesPage />} />
              <Route path="/venues/:id" element={<VenueDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/om-pluggkompis" element={<AboutPluggKompisPage />} />
              <Route path="/faq" element={<FaqPage />} />

              {/* Development Route */}
              <Route path="/components" element={<ComponentShowcase />} />

              {/* Protected Routes - Any Authenticated User */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Coordinator Only */}
              <Route
                path="/coordinator/*"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Coordinator]}>
                    <CoordinatorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Parent Only */}
              <Route
                path="/parent/*"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Parent]}>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Student Only */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Student]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Volunteer Only */}
              <Route
                path="/volunteer/*"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Volunteer]}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch All - Show NotFound Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <BackToTop />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
