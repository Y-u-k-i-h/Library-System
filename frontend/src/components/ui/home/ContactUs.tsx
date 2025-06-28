import {Link} from "react-router-dom";
import SuLibLogo from "../../../../public/SuLogo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faBuildingColumns, faXmark, faPhoneVolume, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Footer from "./Footer.tsx";

export default function ContactUs() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const showMenu = () => {
        setIsMenuOpen(true);
    };

    const hideMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div>
            <section className="about-container">
                <nav className="navigation">
                    <Link to="/home" className="home-link">
                        <img src={SuLibLogo} alt="University Library Logo" />
                    </Link>

                    <div className={`nav-links ${isMenuOpen ? 'nav-open' : ''}`}>
                        <FontAwesomeIcon icon={faXmark} className="close" onClick={hideMenu}/>
                        <ul>
                            <li><Link to="/home">HOME</Link></li>
                            <li><Link to="/about">ABOUT</Link></li>
                            <li><Link to="/contact">CONTACT</Link></li>
                            <li><Link to="/signup">SIGN UP</Link></li>
                            <li><Link to="/login">LOGIN</Link></li>
                        </ul>
                    </div>
                    <FontAwesomeIcon icon={faBars} className="menu" onClick={showMenu}/>
                </nav>

                <div className="about-content">
                    <h1>Contact Us</h1>
                    <p>Get in touch with us. Find our location and contact information below.</p>
                </div>
            </section>

            <section className="location">
                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7760489707557!2d36.81147527577243!3d-1.3096671356537823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10f81d403d27%3A0x5a4e70c9727f2552!2sStrathmore%20University%20Library!5e0!3m2!1sen!2ske!4v1751066280139!5m2!1sen!2ske"
                        width="600"
                        height="450"
                        style={{border: 0}}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </section>

            <section className="contact-details">
                <div className="row">
                    <div className="contact-col">
                        <div>
                            <FontAwesomeIcon icon={faBuildingColumns} className="ui-icon"/>
                            <span>
                                <h5>Ole Sangale Road, Madaraka Estate, Nairobi, Kenya</h5>
                                <p>Turn-Off: Ole Sangale Road</p>
                            </span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faPhoneVolume} className="ui-icon"/>
                            <span>
                                <h5>+254 703 034 000</h5>
                                <p>
                                    Monday to Friday from 8:00 AM to 9:00 PM<br/>
                                    Saturday from 9:00 AM to 6:00 PM<br/>
                                </p>
                            </span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faEnvelope} className="ui-icon"/>
                            <span>
                                <h5>info@strathmore.edu</h5>
                                <p>Email Us Your Query</p>
                            </span>
                        </div>
                    </div>
                    <div className="contact-col">
                        <form>
                            <input type="text" placeholder="Your Name" required/>
                            <input type="email" placeholder="Your Email" required/>
                            <input type="text" placeholder="Subject" required/>
                            <textarea rows={10} placeholder="Your Message" required></textarea>
                            <button type="submit" className="hero-btn learn-more">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    )
}
