import { useState } from "react";

import idIcon from "../../assets/auth-assets/idCard.svg";
import passwordIcon from "../../assets/auth-assets/password.svg";

interface LoginPageProps {
    onGoToSignUp: () => void;
    onGoToForgotPassword?: () => void;
    currentState: string;
}

type LoginFormData = {
    idNumber: string;
    password: string;
}

export default function LoginPage({ onGoToSignUp, onGoToForgotPassword, currentState }: LoginPageProps) {
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

    return (
        <form className="inputs">
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
                <button className={currentState === "Login" ? "submit gray" : "submit"} onClick={onGoToSignUp}>Sign Up</button>
                <button className={currentState === "Create an Account" ? "submit gray" : "submit"}>Log in</button>
            </div>
            <div className="faint-out-button-forgot-password" onClick={onGoToForgotPassword}>Forgot your password?</div>
        </form>
    )
}
