import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthContainer.css";
import nameIcon from "../../assets/auth-assets/user.svg";
import emailIcon from "../../assets/auth-assets/email.svg";
import telephoneIcon from "../../assets/auth-assets/telephone.svg";
import passwordIcon from "../../assets/auth-assets/password.svg";
import IdIcon from "../../assets/auth-assets/idCard.svg";
import { signup } from "../../api/authApi";
import AuthLayout from "./AuthLayout";

interface SignUpPageProps {
    onGoToLogin?: () => void;
    currentState?: string;
    standalone?: boolean;
}

type SignUpFormData = {
    firstName: string;
    lastName: string;
    userID: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
};

export default function SignUpPage({ onGoToLogin, currentState, standalone = false }: SignUpPageProps) {
    const navigate = useNavigate();
    const [signUpFormData, setSignUpFormData] = useState<SignUpFormData>({
        firstName: "",
        lastName: "",
        userID: "",
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

    const handleLoginClick = () => {
        if (standalone) {
            navigate('/login');
        } else {
            onGoToLogin?.();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signUpFormData.password !== signUpFormData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const signupData = {
            fname: signUpFormData.firstName,
            lname: signUpFormData.lastName,
            userCode: signUpFormData.userID,
            email: signUpFormData.email,
            phone: parseInt(signUpFormData.telephone),
            password: signUpFormData.password,
        };

        try {
            const result = await signup(signupData);
            if (result) {
                alert("Sign up successful! Please log in.");
                handleLoginClick();
            } else {
                alert("Sign up failed. Please try again.");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            alert("An error occurred during sign up. Please try again later.");
        }
    }

    const signUpForm = (
        <form className="inputs" onSubmit={handleSubmit}>
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
                <img src={IdIcon} alt="User Icon, User ID" />
                <input
                    type="text"
                    id="userID"
                    name="userID"
                    placeholder="User ID"
                    value={signUpFormData.userID}
                    onChange={(e) => handleInputChange("userID", e.target.value)}
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
                <button 
                    type="submit"
                    className={currentState === "Login" ? "submit gray" : "submit"}
                >
                    Sign Up
                </button>
                <button 
                    type="button"
                    className={currentState === "Create an Account" ? "submit gray" : "submit"}
                    onClick={handleLoginClick}
                >
                    Login
                </button>
            </div>
        </form>
    );

    if (standalone) {
        return (
            <AuthLayout title="Create an Account">
                {signUpForm}
            </AuthLayout>
        );
    }

    return signUpForm;
}
