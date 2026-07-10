import { useEffect, useState, useMemo } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Mail, Lock, Loader2, Eye, EyeOff, Github, Chrome } from "lucide-react";
import { Clerk } from "@clerk/clerk-js";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoaded, userId, signOut } = useAuth();
  const { user } = useUser();

  const [mode, setMode] = useState<"signin" | "signup">(
    new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [clerkInstance, setClerkInstance] = useState<Clerk | null>(null);

  // Initialize Clerk instance
  useEffect(() => {
    const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (publishableKey && !clerkInstance) {
      const clerk = new Clerk(publishableKey);
      clerk.load().then(() => {
        setClerkInstance(clerk);
      });
    }
  }, [clerkInstance]);

  // Update mode when URL changes
  useEffect(() => {
    const urlMode = new URLSearchParams(location.search).get("mode");
    setMode(urlMode === "signup" ? "signup" : "signin");
    setError(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
  }, [location.search]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-background pt-28 text-center text-muted-foreground">Loading...</div>;
  }

  if (userId) {
    return <Navigate to="/pantry" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!clerkInstance?.client) throw new Error("Clerk not initialized");

      // Create sign-in attempt
      const signInAttempt = await clerkInstance.client.signIn.create({
        identifier: email,
        password,
      });

      // Handle the result
      if (signInAttempt.status === "complete") {
        // Successfully signed in, set the active session
        const userId = signInAttempt.createdUserId;
        const sessionId = signInAttempt.createdSessionId;
        
        if (sessionId) {
          await clerkInstance.setActive({ session: sessionId });
          navigate("/pantry");
        }
      } else {
        // Handle incomplete sign-in (e.g., MFA required)
        setError("Sign in incomplete. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.message ||
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Sign in failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      if (!clerkInstance?.client) throw new Error("Clerk not initialized");

      // Create sign-up attempt
      const signUpAttempt = await clerkInstance.client.signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      if (signUpAttempt.status === "complete") {
        // Successfully signed up, set the active session
        const sessionId = signUpAttempt.createdSessionId;
        
        if (sessionId) {
          await clerkInstance.setActive({ session: sessionId });
          navigate("/pantry");
        }
      } else if (signUpAttempt.status === "missing_requirements") {
        setError("Please complete all required fields");
      } else {
        setError("Sign up incomplete. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.message ||
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Sign up failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    if (!clerkInstance) return;
    try {
      // Start OAuth flow
      const signInAttempt = await clerkInstance.client?.signIn.authenticateWithRedirect({
        strategy: provider === "google" ? "oauth_google" : "oauth_github",
        redirectUrl: `/auth/sso-callback`,
        redirectUrlComplete: `/pantry`,
      });
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-md mx-auto px-4 sm:px-6 pt-28 pb-12">
        <div className="glass rounded-3xl border border-border/70 p-6 sm:p-8 shadow-lg">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            {mode === "signin"
              ? "Sign in to continue to Pantry Chef and Dish Generator."
              : "Sign up to save activity history and use protected features."}
          </p>

          {/* Mode Toggle */}
          <div className="grid grid-cols-2 bg-muted/40 rounded-xl p-1 border border-border/60 mb-6">
            <button
              onClick={() => {
                setMode("signin");
                navigate("/auth?mode=signin");
              }}
              className={`px-4 py-2 text-sm font-bold rounded-lg text-center transition-colors ${
                mode === "signin"
                  ? "bg-background text-foreground border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("signup");
                navigate("/auth?mode=signup");
              }}
              className={`px-4 py-2 text-sm font-bold rounded-lg text-center transition-colors ${
                mode === "signup"
                  ? "bg-background text-foreground border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
            {/* Sign Up: First & Last Name */}
            {mode === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="text-xs font-semibold text-foreground/70 mb-2 block">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/70 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-xs font-semibold text-foreground/70 mb-2 block">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/70 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-xs font-semibold text-foreground/70 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border/70 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-xs font-semibold text-foreground/70 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-background border border-border/70 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                  minLength={mode === "signup" ? 8 : 1}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 8 characters
                </p>
              )}
            </div>

            {/* Sign Up: Confirm Password */}
            {mode === "signup" && (
              <div>
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground/70 mb-2 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-background border border-border/70 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-2.5 px-4 gradient-bg text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/50"></div>
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/50"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="py-2 px-3 rounded-xl border border-border/70 bg-background hover:bg-muted/50 text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <Chrome className="w-4 h-4" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="py-2 px-3 rounded-xl border border-border/70 bg-background hover:bg-muted/50 text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
