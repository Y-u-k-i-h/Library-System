import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthContainer.css";
import { requestOtp } from "../../api/authApi";

import emailIcon from "../../assets/auth-assets/email.svg";
import AuthLayout from "./AuthLayout";

interface ForgotPasswordPageProps {
    onGoToLogin?: () => void;
    onGoToEnterOtp?: (email?: string) => void;
    standalone?: boolean;
}

type ForgotPasswordFormData = {
    email: string;
}

export default function ForgotPasswordPage({ onGoToLogin, onGoToEnterOtp, standalone = false }: ForgotPasswordPageProps) {
    const navigate = useNavigate();
    const [forgotPasswordFormData, setForgotPasswordFormData] = useState<ForgotPasswordFormData>({
        email: ""
    });

    const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
        setForgotPasswordFormData(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    const handleSendOtp = (email?: string) => {
        if (standalone) {
            navigate('/enter-otp');
        } else {
            onGoToEnterOtp?.(email);
        }
    };

    const handleBackToLogin = () => {
        if (standalone) {
            navigate('/login');
        } else {
            onGoToLogin?.();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const forgotPasswordData = {
            email: forgotPasswordFormData.email
        };
        
        try {
            const result = await requestOtp(forgotPasswordData.email);
            if (result) {
                // Store email in localStorage for use in OTP verification
                localStorage.setItem("resetEmail", forgotPasswordData.email);
                alert("OTP sent to your email. Please check your inbox or spam.");
                handleSendOtp(forgotPasswordData.email);
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Failed to send OTP. Please try again.");
        }

    };

    const forgotPasswordForm = (
        <form className="inputs" onSubmit={handleSubmit}>
            <div className="input">
                <img src={emailIcon} alt="Email Icon" />
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={forgotPasswordFormData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                />
            </div>
            <div className="submit-container">
                <button 
                    type="submit"
                    className="send-otp-button"
                >
                    Send OTP
                </button>
            </div>
            <div className="faint-out-button-otp" onClick={handleBackToLogin}>
                Back to Login
            </div>
        </form>
    );

    if (standalone) {
        return (
            <AuthLayout title="Forgot Password">
                {forgotPasswordForm}
            </AuthLayout>
        );
    }

    return forgotPasswordForm;
}
