import nameIcon from "../../assets/name.png";
import emailIcon from "../../assets/email.png";
import telephoneIcon from "../../assets/telephone.png";
import passwordIcon from "../../assets/lock.png";
import { useState } from "react";

interface SignUpPageProps {
    onGoToLogin: () => void;
    currentState: string;
}

export default function SignUpPage({ onGoToLogin, currentState }: SignUpPageProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <form className="inputs">
            <div className="input">
                <img src={nameIcon} alt="User Icon, First Name" />
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>
            <div className="input">
                <img src={nameIcon} alt="User Icon, Last Name"/>
                <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
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
            <div className="input">
                <img src={telephoneIcon} alt="Telephone Icon" />
                <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    placeholder="Telephone Number"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
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
            <div className="input">
                <img src={passwordIcon} alt="Password Icon" />
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <div className="submit-container">
                <button className={currentState === "Login" ? "submit gray" : "submit"}>Sign Up</button>
                <button className={currentState === "Create an Account" ? "submit gray" : "submit"} onClick={onGoToLogin}>Login</button>
            </div>
        </form>
    )
}
