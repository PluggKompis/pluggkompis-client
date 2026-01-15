import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../components/common";
import { Eye, EyeOff } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Logga in</h1>
          <p className="text-neutral-secondary">Välkommen tillbaka till PluggKompis!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@email.se"
            required
          />

          <div className="relative">
            <Input
              label="Lösenord"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
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

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Logga in
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
