import emailIcon from "../../assets/email.png";
import { useState } from "react";

interface ForgotPasswordPageProps {
    onGoToLogin: () => void;
    onGoToEnterOtp: () => void;
}

export default function ForgotPasswordPage({ onGoToLogin, onGoToEnterOtp }: ForgotPasswordPageProps) {
    const [email, setEmail] = useState("");

    return (
        <form className="inputs">
            <div className="input">
                <img src={emailIcon} alt="Email Icon" />
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="submit-container">
                <button className="send-otp-button" onClick={onGoToEnterOtp}>Send OTP</button>
            </div>
            <div className="faint-out-button" onClick={onGoToLogin}>Back to Login</div>
        </form>
        )
}
