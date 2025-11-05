import { createContext, useContext, useState, type ReactNode } from "react";
import type { IAuthContext } from "../interfaces";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const setTokens = (newAccessToken: string, newRefreshToken: string) => {
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, setTokens: setTokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context =  useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}