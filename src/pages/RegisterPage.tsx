import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../components/common";
import { Eye, EyeOff } from "lucide-react";

type UserRole = "Parent" | "Student" | "Volunteer" | "Coordinator";

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>("Parent");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", { ...formData, role });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Registrera</h1>
          <p className="text-neutral-secondary">Skapa ditt konto på PluggKompis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="input-label">Välj roll</label>
            <div className="grid grid-cols-2 gap-2">
              {(["Parent", "Student", "Volunteer", "Coordinator"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    role === r
                      ? "bg-primary text-white"
                      : "bg-neutral-bg text-black hover:bg-gray-200"
                  }`}
                >
                  {r === "Parent" && "Förälder"}
                  {r === "Student" && "Elev"}
                  {r === "Volunteer" && "Volontär"}
                  {r === "Coordinator" && "Koordinator"}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Förnamn"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Anna"
            required
          />

          <Input
            label="Efternamn"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Andersson"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="din@email.se"
            required
          />

          <div className="relative">
            <Input
              label="Lösenord"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Minst 8 tecken"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-neutral-secondary hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Input
            label="Upprepa lösenord"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Skriv lösenordet igen"
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Registrera
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-secondary">
            Har du redan ett konto?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Logga in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
