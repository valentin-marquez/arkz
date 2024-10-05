"use client";

import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleSetCookie = (name: string, value: string, days: number) => {
    setCookie(name, value, {
      maxAge: days * 24 * 60 * 60,
      path: "/",
    });
  };

  const handleGetCookie = (name: string) => {
    return getCookie(name);
  };

  const handleDeleteCookie = (name: string) => {
    deleteCookie(name, { path: "/" });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setIsLoading(true);
          switch (event) {
            case "SIGNED_IN":
              if (session?.user) {
                setUser(session.user);
                const welcomeShown = handleGetCookie("welcomeShown");
                if (!welcomeShown) {
                  toast({
                    title: "🔓 Signed In!",
                    description: `Welcome back, ${session.user.user_metadata.full_name}!`,
                    duration: 3000,
                  });
                  handleSetCookie("welcomeShown", "true", 1);
                }
              }
              break;
            case "SIGNED_OUT":
              setUser(null);
              handleDeleteCookie("welcomeShown");
              toast({
                title: "🔒 Signed Out",
                description: "You have been signed out. See you later!",
                duration: 3000,
              });
              break;
            default:
              break;
          }
          setIsLoading(false);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, [router, supabase, toast]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    handleDeleteCookie("welcomeShown");
    setIsLoading(false);
  }, [supabase]);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, [supabase]);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      signOut,
      signIn,
    }),
    [user, isLoading, signOut, signIn]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
