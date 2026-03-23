"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { ChefHat } from "lucide-react";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Kitchen Tech Sheets</h1>
            <p className="text-sm text-gray-500">Gestion de fiches techniques culinaires</p>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            {mode === "signin" ? "Connexion" : "Créer un compte"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="chef@restaurant.com"
            />
            <FormInput
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {mode === "signin" ? "Se connecter" : "Créer le compte"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            {mode === "signin" ? (
              <>
                Pas de compte ?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="font-medium text-primary-600 hover:underline"
                >
                  S&apos;inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="font-medium text-primary-600 hover:underline"
                >
                  Se connecter
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
