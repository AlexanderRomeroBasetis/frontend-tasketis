import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/authService";
import '../styles/login-page.css';

declare global {
    interface Window {
        google?: any;
    }
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { setTokens } = useAuth();
    const googleButtonDiv = React.useRef<HTMLDivElement>(null);

    const handleGoogleSignIn = async (response: any /* google.accounts.id.CredentialResponse */) => {
        try {
            const backendResponse = await authService.loginWithGoogle(response.credential);
            setTokens(backendResponse.accessToken, backendResponse.refreshToken);
            navigate('/task-generator');

        } catch (error) {
            throw new Error("Login fallido");
        }
    };

    useEffect(() => {
        if (window.google && googleButtonDiv.current) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleSignIn,
            });

            window.google.accounts.id.renderButton(
                googleButtonDiv.current,
                { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with' }
            );
        }
    }, []);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Login</h1>
                    <p>Sign in with your Google account</p>
                </div>
                <div id="google-signin-button" ref={googleButtonDiv}></div>
            </div>
        </div>
    );
};

export default Login;