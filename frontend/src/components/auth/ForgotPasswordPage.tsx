import { useState } from "react";
import { useNavigate } from "react-router-dom";

import emailIcon from "../../assets/auth-assets/email.svg";
import AuthLayout from "./AuthLayout";

interface ForgotPasswordPageProps {
    onGoToLogin?: () => void;
    onGoToEnterOtp?: () => void;
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

    const handleSendOtp = () => {
        if (standalone) {
            navigate('/enter-otp');
        } else {
            onGoToEnterOtp?.();
        }
    };

    const handleBackToLogin = () => {
        if (standalone) {
            navigate('/login');
        } else {
            onGoToLogin?.();
        }
    };

    const forgotPasswordForm = (
        <form className="inputs">
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
                    type="button" 
                    className="send-otp-button" 
                    onClick={handleSendOtp}
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
