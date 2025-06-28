import "./home.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faXTwitter, faInstagram, faLinkedinIn} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <footer className="footer">
            <h4>About Us</h4>
            <p>Our mission is to deliver inclusive, high-quality academic services that enhance teaching, research, and lifelong learning.<br/> We uphold the university’s values by fostering integrity, intellectual curiosity, and academic excellence.</p>
            <div>
                <FontAwesomeIcon icon={faFacebookF} className="icons" />
                <FontAwesomeIcon icon={faXTwitter} className="icons" />
                <FontAwesomeIcon icon={faInstagram} className="icons" />
                <FontAwesomeIcon icon={faLinkedinIn} className="icons" />
            </div>
        </footer>
    )
}