import { useState } from "react";

import nameIcon from "../../assets/auth-assets/user.svg";
import emailIcon from "../../assets/auth-assets/email.svg";
import telephoneIcon from "../../assets/auth-assets/telephone.svg";
import passwordIcon from "../../assets/auth-assets/password.svg";

interface SignUpPageProps {
    onGoToLogin: () => void;
    currentState: string;
}

type SignUpFormData = {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
};

export default function SignUpPage({ onGoToLogin, currentState }: SignUpPageProps) {

    const [signUpFormData, setSignUpFormData] = useState<SignUpFormData>({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        password: "",
        confirmPassword: ""
    });

    const handleInputChange = (field: keyof SignUpFormData, value: string) => {
        setSignUpFormData(prevData => ({
            ...prevData,
            [field]: value
        }));
    }
    return (
        <form className="inputs">
            <div className="input">
                <img src={nameIcon} alt="User Icon, First Name" />
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="First name"
                    value={signUpFormData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                    value={signUpFormData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                    value={signUpFormData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    value={signUpFormData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
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
                    value={signUpFormData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
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
                    value={signUpFormData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
