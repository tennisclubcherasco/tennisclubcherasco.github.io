import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig"; // importa la configurazione Firebase
import { onAuthStateChanged } from "firebase/auth";

// Crea il contesto
const AuthContext = createContext();

// Crea il provider
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook personalizzato per utilizzare il contesto
export const useAuth = () => {
    return useContext(AuthContext);
};