"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

type AuthContextType = {
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
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
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case "INITIAL_SESSION":
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
                handleSetCookie("welcomeShown", "true", 1); // Set cookie to expire in 1 day
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
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase, toast]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    handleDeleteCookie("welcomeShown");
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
