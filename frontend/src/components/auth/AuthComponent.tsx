import {useState} from "react";

import SignUpPage from "./SignUpPage.tsx";
import LoginPage from "./LoginPage.tsx";
import ForgotPasswordPage from "./ForgotPasswordPage.tsx";
import EnterOtpPage from "./EnterOtpPage.tsx";
import ResetPasswordPage from "./ResetPasswordPage.tsx";
import "./AuthContainer.css";

const AUTH_STATES = {
    SIGNUP: "Create an Account",
    LOGIN: "Login",
    FORGOT_PASSWORD: "Forgot Password",
    ENTER_OTP: "Enter OTP",
    RESET_PASSWORD: "Reset Password"
};

export default function AuthComponent() {
    const [currentState, setCurrentState] = useState(AUTH_STATES.SIGNUP);
    const [userEmail, setUserEmail] = useState<string>("");

    const goToSignUp = () => setCurrentState(AUTH_STATES.SIGNUP);
    const goToLogin = () => setCurrentState(AUTH_STATES.LOGIN);
    const goToForgotPassword = () => setCurrentState(AUTH_STATES.FORGOT_PASSWORD);
    const goToEnterOtp = (email?: string) => {
        if (email) setUserEmail(email);
        setCurrentState(AUTH_STATES.ENTER_OTP);
    };
    const goToResetPassword = () => setCurrentState(AUTH_STATES.RESET_PASSWORD);

    const headerState = () => {
        switch (currentState) {
            case AUTH_STATES.SIGNUP:
                return "Create an Account";
            case AUTH_STATES.LOGIN:
                return "Login";
            case AUTH_STATES.FORGOT_PASSWORD:
                return "Forgot Password";
            case AUTH_STATES.ENTER_OTP:
                return "Enter OTP";
            case AUTH_STATES.RESET_PASSWORD:
                return "Reset Password";
            default:
                return "";
        }
    }

    const renderCurrentState = () => {
        switch (currentState) {
            case AUTH_STATES.SIGNUP:
                return <SignUpPage onGoToLogin={goToLogin}
                                   currentState={currentState} />;

            case AUTH_STATES.LOGIN:
                return <LoginPage onGoToSignUp={goToSignUp}
                                  currentState={currentState}
                                  onGoToForgotPassword={goToForgotPassword}  />;

            case AUTH_STATES.FORGOT_PASSWORD:
                return <ForgotPasswordPage onGoToLogin={goToLogin}
                                           onGoToEnterOtp={goToEnterOtp} />;

            case AUTH_STATES.ENTER_OTP:
                return <EnterOtpPage onOtpVerified={goToResetPassword} email={userEmail} />;

            case AUTH_STATES.RESET_PASSWORD:
                return <ResetPasswordPage onPasswordReset={goToLogin} />;

            default:
                return <SignUpPage onGoToLogin={goToLogin}
                                   currentState={currentState}/>;
        }
    }

    return (
        <div className="auth-container">
            <div className="header">
                <div className="text-header ">{headerState()}</div>
                <div className="underline"></div>
            </div>
            {renderCurrentState()}
        </div>
    )
};

// Export individual standalone components for use in pages
export { default as StandaloneLogin } from './LoginPage';
export { default as StandaloneSignUp } from './SignUpPage';
export { default as StandaloneForgotPassword } from './ForgotPasswordPage';
export { default as StandaloneEnterOtp } from './EnterOtpPage';
export { default as StandaloneResetPassword } from './ResetPasswordPage';
export { default as AuthLayout } from './AuthLayout';
