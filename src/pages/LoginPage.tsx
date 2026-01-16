import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button, Input } from "../components/common";
import { useAuth } from "@/hooks";
import { UserRole } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Lösenord krävs"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setApiError("");

      await login(data.email, data.password);

      // Redirect to role-specific dashboard
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      switch (user.role) {
        case UserRole.Coordinator:
          navigate("/coordinator");
          break;
        case UserRole.Parent:
          navigate("/parent");
          break;
        case UserRole.Student:
          navigate("/student");
          break;
        case UserRole.Volunteer:
          navigate("/volunteer");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Inloggningen misslyckades";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Logga in</h1>
          <p className="text-neutral-secondary">Välkommen tillbaka till PluggKompis!</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="din@email.se"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="relative">
            <Input
              label="Lösenord"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-neutral-secondary hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Loggar in..." : "Logga in"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-secondary">
            Har du inget konto?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Registrera dig
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
