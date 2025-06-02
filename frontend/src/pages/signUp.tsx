import '../components/auth/AuthContainer.css';
import nameIcon from '../assets/name.png';
import idIcon from '../assets/id.png';
import telephoneIcon from '../assets/telephone.png';
import emailIcon from '../assets/email.png';
import passwordIcon from '../assets/lock.png';
import { useState } from 'react';

export default function SignUp() {

    const [action, setAction] = useState("Create an Account");
    const [forgotPassword, setForgotPassword] = useState(false);

    const handleForgotPasswordClick = () => {
        setForgotPassword(true);
    }

    const handleBackToLoginClick = () => {
        setForgotPassword(false);
    }

    return (
        <form className="signUp">
            <div className="header">
                <div className="text-header">{action}</div>
                <div className={action === "Create an Account" ? "underline-signup" : "underline-login"}></div>
            </div>

            {forgotPassword ?
                    <div className="inputs">
                        <div className="input">
                            <img src={emailIcon} alt="Email Icon"/>
                            <input type="email" id="email" name="email" placeholder="Email" required/>
                        </div>
                        <div className="submit-container">
                            <div className="send-code-button">Send Code</div>
                        </div>
                        <div className="faint-out-button" onClick={handleBackToLoginClick}>Back to Login</div>
                    </div>
                 :
                <div className="inputs">
                {action === "Login" ?  <div className="input">
                    <img src={idIcon} alt="Identification Number Icon"/>
                    <input type="text" id="idNumber" name="idNumber" placeholder="Membership/Student ID" required/>
                </div> : <div className="input">
                    <img src={nameIcon} alt="User Icon"/>
                    <input type="text" id="username" name="username" placeholder="First name & Last name" required/>
                </div>}

                {action === "Login" ? <div className="div-nothing"></div> : <div className="input">
                    <img src={emailIcon} alt="Email Icon"/>
                    <input type="email" id="email" name="email" placeholder="Email" required/>
                </div>}

                {action === "Login" ? <div className="div-nothing"></div> : <div className="input">
                    <img src={telephoneIcon} alt="Telephone Icon"/>
                    <input type="tel" id="telephone" name="telephone" placeholder="Telephone Number" required/>
                </div>}

                <div className="input">
                    <img src={passwordIcon} alt="Password Icon"/>
                    <input type="password" id="password" name="password" placeholder="Password" required/>
                </div>

                {action === "Login" ? <div className="div-nothing"></div> : <div className="input">
                    <img src={passwordIcon} alt="Password Icon"/>
                    <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password"
                           required/>
                </div>}

                {action === "Create an Account" ? <div className="div-nothing"></div> :
                    <div className="faint-out-button" onClick={handleForgotPasswordClick}>Forgot Password?</div>}

                <div className="submit-container">
                    <div className={action === "Login" ? "submit gray" : "submit"} onClick={()=>{setAction("Create an Account")}}>Sign Up</div>
                    <div className={action === "Create an Account" ? "submit gray" : "submit"} onClick={() =>{setAction("Login")}}>Login</div>
                </div>

            </div>
                }
        </form>
    );
}
