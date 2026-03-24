import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const initialMode = new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    if (mode === "signin") {
      const result = await signIn(email.trim(), password);
      setLoading(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      navigate("/pantry", { replace: true });
      return;
    }

    const result = await signUp(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailVerification) {
      setNotice("Account created. Please verify your email, then sign in.");
      setMode("signin");
      return;
    }

    navigate("/pantry", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-md mx-auto px-4 sm:px-6 pt-28 pb-12">
        <div className="glass rounded-3xl border border-border/70 p-6 sm:p-8 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "signin" ? "Sign in to continue to Pantry Chef and Dish Generator." : "Sign up to save activity history and use protected features."}
          </p>

          <div className="mt-6 grid grid-cols-2 bg-muted/40 rounded-xl p-1 border border-border/60">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
                setNotice(null);
              }}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                mode === "signin" ? "bg-background text-foreground border border-border/70" : "text-muted-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
                setNotice(null);
              }}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                mode === "signup" ? "bg-background text-foreground border border-border/70" : "text-muted-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full h-11 px-3 rounded-xl border border-border/70 bg-background"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full h-11 px-3 rounded-xl border border-border/70 bg-background"
                placeholder="Minimum 6 characters"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {notice && <p className="text-sm text-emerald-700">{notice}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl gradient-bg text-white font-bold disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Auth;
