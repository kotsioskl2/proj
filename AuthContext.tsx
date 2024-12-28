import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.role === "admin");
    };

    getSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);