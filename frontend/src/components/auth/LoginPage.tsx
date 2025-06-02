import idIcon from "../../assets/id.png";
import passwordIcon from "../../assets/lock.png";
import { useState } from "react";

interface LoginPageProps {
    onGoToSignUp: () => void;
    onGoToForgotPassword?: () => void;
    currentState: string;
}

export default function LoginPage({ onGoToSignUp, onGoToForgotPassword, currentState }: LoginPageProps) {
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form className="inputs">
            <div className="input">
                <img src={idIcon} alt="ID Icon" />
                <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    placeholder="Membership/Student ID"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="faint-out-button" onClick={onGoToForgotPassword}>Forgot Password?</div>
            <div className="submit-container">
                <button className={currentState === "Login" ? "submit gray" : "submit"} onClick={onGoToSignUp}>Sign Up</button>
                <button className={currentState === "Create an Account" ? "submit gray" : "submit"}>Log in</button>
            </div>
        </form>
    )
}