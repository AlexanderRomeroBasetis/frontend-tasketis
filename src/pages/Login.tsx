import React from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { IUserGoogleData } from "../interfaces";
import '../styles/login-page.css';
import { authService } from "../api/AuthService";


const Login: React.FC = () => {
    const navigate = useNavigate();
    const { setTokens } = useAuth();

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        const credential = credentialResponse.credential;

        if (!credential) {
            console.log('No credential returned');
            return;
        }
        
        try {
            const payload = JSON.parse(atob(credential.split('.')[1]));

            const userGoogleData: IUserGoogleData = {
                email: payload.email,
                name: payload.name,
                sub: payload.sub,
                picture: payload.picture || '',
            };

            const tokens = await authService.getBackendTokens(userGoogleData);

            if (tokens) {
                setTokens(tokens.accessToken, tokens.refreshToken);
                navigate('/test-case-generator');
            }

        } catch (error) {
            throw new Error("Login fallido");
        }
    };

    const handleLoginError = () => {
        console.log('Login Failed');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Login</h1>
                    <p>Sign in with your Google account</p>
                </div>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                />
            </div>
        </div>
    );
};

export default Login;