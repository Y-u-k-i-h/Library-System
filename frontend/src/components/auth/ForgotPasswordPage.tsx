import { useState } from "react";

import emailIcon from "../../assets/auth-assets/email.svg";

interface ForgotPasswordPageProps {
    onGoToLogin: () => void;
    onGoToEnterOtp: () => void;
}

type ForgotPasswordFormData = {
    email: string;
}

export default function ForgotPasswordPage({ onGoToLogin, onGoToEnterOtp }: ForgotPasswordPageProps) {
    const [forgotPasswordFormData, setForgotPasswordFormData] = useState<ForgotPasswordFormData>({
        email: ""
    });

    const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
        setForgotPasswordFormData(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    return (
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
                <button className="send-otp-button" onClick={onGoToEnterOtp}>Send OTP</button>
            </div>
            <div className="faint-out-button-otp" onClick={onGoToLogin}>Back to Login</div>
        </form>
        )
}
