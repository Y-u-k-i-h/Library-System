import React from "react";
import {useState, useRef, useEffect, type ChangeEvent} from "react";
import { useNavigate } from "react-router-dom";
import './AuthContainer.css';
import AuthLayout from "./AuthLayout";
import { requestOtp, verifyOtp } from "../../api/authApi";

interface EnterOtpPageProps {
    onOtpVerified?: (otp: string) => void;
    standalone?: boolean;
    email?: string;
}
export default function EnterOtpPage({ onOtpVerified, standalone = false, email }: EnterOtpPageProps) {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timeLeft, setTimeLeft] = useState(30);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    
    // Get email from props or localStorage
    const userEmail = email || localStorage.getItem("resetEmail") || "";

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    console.log(otp); // For debugging purposes, you can remove this later

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        // Targeting the input value
        const inputValue = e.target.value;

        // Validate input to ensure it's a single digit
        if(isNaN(Number(inputValue))) {
            return;
        }
        const newOtp = [...otp];
        newOtp[index] = inputValue.substring(inputValue.length - 1);
        setOtp(newOtp);

        // Auto verify when all six inputs are filled
        const combinedOtp = newOtp.join("");
        if(combinedOtp.length === 6) {
            handleOtpSubmit(combinedOtp);
        }

        // Move to the next input if the current input is filled
        if(inputValue && index < 5) {
            const nextEmptyIndex = otp.findIndex((value, i) => i > index && value === "");
            if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
                inputRefs.current[nextEmptyIndex]?.focus();
            }
        }
    }

    // Function to handle OTP submission
    const handleOtpSubmit = async (combinedOtp: string) => {
        if (!userEmail) {
            alert("Email not found. Please go back to forgot password.");
            return;
        }
        
        const verifyOtpData = {
            email: userEmail,
            otp: combinedOtp
        };

        try {
            await verifyOtp(verifyOtpData);
            alert("OTP verified successfully!");

            // Storing the email in local storage for use in ResetPasswordPage
            localStorage.setItem("email", verifyOtpData.email);

            if (standalone) {
                navigate("/reset-password");
            } else {
                onOtpVerified?.(combinedOtp);
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Failed to verify OTP. Please try again.");

            // Clear the OTP inputs
            setOtp(new Array(6).fill(""));
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }
    }

    // Handle backspace to move focus to the previous input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if(e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    const handleInputFieldClick = (index: number) => {
        // Set the cursor to the end of the input field when clicked
        inputRefs.current[index]?.setSelectionRange(1, 1);

        // Focus on the previous input field if there are any empty inputs before the clicked one
        if(index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")]?.focus();
        }
    }

    // Function to handle resend OTP button click
    const handleResendOtp = () => {
        console.log("Resend OTP clicked, resending otp...");
        
        if (!userEmail) {
            alert("Email not found. Please go back to forgot password.");
            return;
        }
        
        const requestOtpData = {
            email: userEmail
        };

        try {
            requestOtp(requestOtpData.email);
            alert("OTP resent successfully! Please check your email.");
        } catch (error) {
            console.error("Error resending OTP:", error);
            alert("Failed to resend OTP. Please try again.");
        }

        setTimeLeft(30);
        setOtp(new Array(6).fill(""));
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }

    const otpForm = (
        <div className="otp">
            <div className="otp-container">
                {
                    otp.map((element, index) => (
                        <input type="text"
                               key={index}
                               ref={(input) => {inputRefs.current[index] = input;}}
                               inputMode="numeric"
                               autoComplete="one-time-code"
                               pattern="\d{1}"
                               maxLength={1}
                               className="otp-inputs"
                               value={element}
                               onChange={(e) => {handleChange(e, index)}}
                               onKeyDown={(e) => {handleKeyDown(e, index)}}
                               onClick={() => {handleInputFieldClick(index)}}
                        />
                    ))
                }
            </div>
            <button
                className="otp-resend-button"
                onClick={() => handleResendOtp()}
                disabled={timeLeft > 0}
            >
                {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
            </button>
        </div>
    );

    if (standalone) {
        return (
            <AuthLayout title="Enter OTP">
                {otpForm}
            </AuthLayout>
        );
    }

    return otpForm;
}
