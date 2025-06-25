import { useState } from "react";

import passwordIcon from "../../assets/auth-assets/password.svg";

interface ResetPasswordPageProps {
    onPasswordReset: () => void;
}

type ResetPasswordFormData = {
    newPassword: string;
    confirmPassword: string;
};

export default function ResetPasswordPage({ onPasswordReset }: ResetPasswordPageProps) {

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

    return (
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
                <button className="send-button" onClick={onPasswordReset}>Reset Password</button>
            </div>
        </form>
    )
}
