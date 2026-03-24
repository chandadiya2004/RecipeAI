import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useAuth as useClerkAuth, useUser, type UserResource } from "@clerk/clerk-react";

interface AuthContextValue {
  user: UserResource | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded: isAuthLoaded, getToken, signOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  const isLoading = !isAuthLoaded || !isUserLoaded;

  const getAccessToken = useCallback(async () => {
    return getToken();
  }, [getToken]);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signOut: handleSignOut,
      getAccessToken,
    }),
    [user, isLoading, handleSignOut, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
