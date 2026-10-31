import { createContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para mudar o status no banco
  const changeUserStatus = async (uid, newStatus) => {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { status: newStatus });
    } catch (error) {
      console.error("Erro ao mudar status:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Assim que logar ou recarregar a página, garante que está "available"
        await changeUserStatus(currentUser.uid, "available");
      }
    });

    return () => unsubscribe();
  }, []);

  // Monitora quando o usuário tenta fechar a aba ou o navegador
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (user) {
        // Dispara a atualização para offline antes da aba morrer
        changeUserStatus(user.uid, "offline");
      }
    };

    // 'beforeunload' é disparado quando a aba é fechada ou atualizada (F5)
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, changeUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}
