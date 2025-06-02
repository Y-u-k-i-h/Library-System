import './AuthContainer.css';

export default function EnterOtpPage() {
    return (
        <div className="otp">
            <div className="otp-container">
                {
                    [1, 2, 3, 4, 5, 6].map((digit, index) => (
                        <input type="text"
                               key={index}
                               inputMode="numeric"
                               autoComplete="one-time-code"
                               pattern="\d{1}"
                               maxLength={6}
                               className="otp-inputs"
                        />
                    ))
                }
            </div>
            <button className="otp-submit-button">Verify OTP</button>
        </div>
    )
}
