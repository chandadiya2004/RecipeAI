import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import RecipeGenerator from "./pages/RecipeGenerator.tsx";
import PantryChef from "./pages/PantryChef.tsx";
import History from "./pages/History.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

// Scrolls to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/pantry"
            element={
              <>
                <SignedIn>
                  <PantryChef />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/generator"
            element={
              <>
                <SignedIn>
                  <RecipeGenerator />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/history"
            element={
              <>
                <SignedIn>
                  <History />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
