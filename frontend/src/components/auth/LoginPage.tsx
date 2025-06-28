import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";

import idIcon from "../../assets/auth-assets/idCard.svg";
import passwordIcon from "../../assets/auth-assets/password.svg";
import AuthLayout from "./AuthLayout";

interface LoginPageProps {
    onGoToSignUp?: () => void;
    onGoToForgotPassword?: () => void;
    currentState?: string;
    standalone?: boolean;
}

type LoginFormData = {
    idNumber: string;
    password: string;
}

export default function LoginPage({ onGoToSignUp, onGoToForgotPassword, currentState, standalone = false }: LoginPageProps) {
    const navigate = useNavigate();
    const [LoginFormData, setLoginFormData] = useState<LoginFormData>({
        idNumber: "",
        password: ""
    });

    const handleInputChange = (field: keyof LoginFormData, value: string) => {
        setLoginFormData(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    const handleSignUpClick = () => {
        if (standalone) {
            navigate('/signup');
        } else {
            onGoToSignUp?.();
        }
    };

    const handleForgotPasswordClick = () => {
        if (standalone) {
            navigate('/forgot-password');
        } else {
            onGoToForgotPassword?.();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const LoginData = {
            userCode: LoginFormData.idNumber,
            password: LoginFormData.password
        }

        try {
        const result = await login(LoginData);
        if (result) {
            alert("Login successful! Welcome");
            navigate("/dashboard"); // Redirect to home page or dashboard
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please check your ID and password.");
    }
    };


    const loginForm = (
        <form className="inputs" onSubmit={handleSubmit}>
            <div className="input">
                <img src={idIcon} alt="ID Icon" />
                <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    placeholder="Membership/Student ID"
                    value={LoginFormData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    required
                />
            </div>
            <div className="input">
                <img src={passwordIcon} alt="Password Icon" />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={LoginFormData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                />
            </div>
            <div className="submit-container">
                <button 
                    type="button"
                    className={currentState === "Login" ? "submit gray" : "submit"} 
                    onClick={handleSignUpClick}
                >
                    Sign Up
                </button>
                <button 
                    type="submit"
                    className={currentState === "Create an Account" ? "submit gray" : "submit"}
                >
                    Log in
                </button>
            </div>
            <div className="faint-out-button-forgot-password" onClick={handleForgotPasswordClick}>
                Forgot your password?
            </div>
        </form>
    );

    if (standalone) {
        return (
            <AuthLayout title="Login">
                {loginForm}
            </AuthLayout>
        );
    }

    return loginForm;
}
