import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import { AuthProvider } from "@/context/AuthContext";
import "./index.css";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in frontend environment variables.");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={clerkPublishableKey}
    signInUrl="/auth?mode=signin"
    signUpUrl="/auth?mode=signup"
    afterSignOutUrl="/"
  >
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="recipeai-theme">
        <App />
      </ThemeProvider>
    </AuthProvider>
  </ClerkProvider>,
);
