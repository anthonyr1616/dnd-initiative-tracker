import { useState, useEffect } from "react";
import { AuthContext } from "../helpers/useAuth";
import { subscribeToAuthState } from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = subscribeToAuthState(setUser);
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}
