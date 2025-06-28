import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
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

export default function ResetPasswordPage({ onPasswordReset, standalone = false}: ResetPasswordPageProps) {
    // Using local storage to store email for ResetPasswordPage
    const email = localStorage.getItem("email");
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

    const handleResetPassword = async (e:React.FormEvent) => {
        e.preventDefault();

        if (resetPasswordFormData.newPassword !== resetPasswordFormData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!resetPasswordFormData.newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.");
            return;
        }

        const resetPasswordData = {
            email: email || "", // Use the email from localStorage
            newPassword: resetPasswordFormData.newPassword,
            confirmPassword: resetPasswordFormData.confirmPassword
        };

        try {
            const result = await resetPassword(resetPasswordData);
            if (result) {
                alert("Password reset successfully!");
                localStorage.removeItem("email"); // Clean up after success
                if (standalone) {
                    navigate('/login');
                } else {
                    onPasswordReset?.();
                }
            }
        } catch (error: any) {
            console.error("Error resetting password:", error);
            alert(error.response?.data || "Failed to reset password. Please try again.");
        }


    }

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
