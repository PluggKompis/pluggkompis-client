import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button, Input } from "../components/common";
import { useAuth } from "@/hooks";
import { UserRole } from "@/types";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Förnamn måste vara minst 2 tecken"),
    lastName: z.string().min(2, "Efternamn måste vara minst 2 tecken"),
    email: z.string().email("Ogiltig e-postadress"),
    password: z.string().min(8, "Lösenord måste vara minst 8 tecken"),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.Student, // Default role
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setApiError("");

      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      // Redirect to role-specific dashboard
      switch (data.role) {
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
      const errorMessage = error instanceof Error ? error.message : "Registreringen misslyckades";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Skapa konto</h1>
          <p className="text-neutral-secondary">
            Gå med i PluggKompis och börja hjälpa eller få hjälp!
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div>
            <Input
              label="Förnamn"
              type="text"
              placeholder="Anna"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
          </div>

          {/* Last Name */}
          <div>
            <Input
              label="Efternamn"
              type="text"
              placeholder="Andersson"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="anna@email.se"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              label="Lösenord"
              type={showPassword ? "text" : "password"}
              placeholder="Minst 6 tecken"
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

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Bekräfta lösenord"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ange lösenordet igen"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[42px] text-neutral-secondary hover:text-black"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Jag är en...</label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-neutral-stroke rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  value={UserRole.Student}
                  {...register("role")}
                  className="w-4 h-4 text-primary"
                />
                <div className="ml-3">
                  <p className="font-semibold">Elev</p>
                  <p className="text-sm text-neutral-secondary">Jag vill få läxhjälp</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-neutral-stroke rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  value={UserRole.Parent}
                  {...register("role")}
                  className="w-4 h-4 text-primary"
                />
                <div className="ml-3">
                  <p className="font-semibold">Förälder</p>
                  <p className="text-sm text-neutral-secondary">
                    Jag vill boka hjälp för mitt barn
                  </p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-neutral-stroke rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  value={UserRole.Volunteer}
                  {...register("role")}
                  className="w-4 h-4 text-primary"
                />
                <div className="ml-3">
                  <p className="font-semibold">Volontär</p>
                  <p className="text-sm text-neutral-secondary">Jag vill hjälpa andra med läxor</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-neutral-stroke rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  value={UserRole.Coordinator}
                  {...register("role")}
                  className="w-4 h-4 text-primary"
                />
                <div className="ml-3">
                  <p className="font-semibold">Koordinator</p>
                  <p className="text-sm text-neutral-secondary">Jag vill hantera en plats</p>
                </div>
              </label>
            </div>
            {errors.role && <p className="text-error text-sm mt-2">{errors.role.message}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Skapar konto..." : "Skapa konto"}
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
