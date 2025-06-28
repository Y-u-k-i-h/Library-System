import { useState } from "react";
import { useNavigate } from "react-router-dom";

import passwordIcon from "../../assets/auth-assets/password.svg";
import AuthLayout from "./AuthLayout";

interface ResetPasswordPageProps {
    onPasswordReset?: () => void;
    standalone?: boolean;
}

type ResetPasswordFormData = {
    newPassword: string;
    confirmPassword: string;
};

export default function ResetPasswordPage({ onPasswordReset, standalone = false }: ResetPasswordPageProps) {
    const navigate = useNavigate();
    const [resetPasswordFormData, setResetPasswordFormData] = useState<ResetPasswordFormData>({
        newPassword: "",
        confirmPassword: ""
    });

    const handleInputChange = (field: keyof ResetPasswordFormData, value: string) => {
        setResetPasswordFormData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleResetPassword = () => {
        if (standalone) {
            // TODO: API call to reset password, then navigate to login
            navigate('/login');
        } else {
            onPasswordReset?.();
        }
    };

    const resetPasswordForm = (
        <form className="inputs">
            <div className="input">
                <img src={passwordIcon} alt="Password Icon" />
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    value={resetPasswordFormData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    required
                />
            </div>
            <div className="input">
                <img src={passwordIcon} alt="Confirm Password Icon" />
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={resetPasswordFormData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                />
            </div>
            <div className="submit-container">
                <button 
                    type="button" 
                    className="send-otp-button" 
                    onClick={handleResetPassword}
                >
                    Reset Password
                </button>
            </div>
        </form>
    );

    if (standalone) {
        return (
            <AuthLayout title="Reset Password">
                {resetPasswordForm}
            </AuthLayout>
        );
    }

    return resetPasswordForm;
}
