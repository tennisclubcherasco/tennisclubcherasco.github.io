import {Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";

export interface RoleContextType {
    role: string | null;
    setRole: Dispatch<SetStateAction<string | null>>;
}

export const RoleContext = createContext<RoleContextType>({
    role: "",
    setRole: () => {},
})

interface RoleProviderProps {
    children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

    useEffect(() => {
        if (role === null) {
            localStorage.removeItem('role');
        } else {
            localStorage.setItem('role', role);
        }
    }, [role]);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};