import "./home.css";
import {useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

import SuLibLogo from "../../../../public/SuLogo.png";

export default function HomeHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const showMenu = () => {
        setIsMenuOpen(true);
    };

    const hideMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div>
            <section className="home-body">
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

                <div className="text-box">
                    <h1>Strathmore University Library</h1>
                    <p>Your gateway to knowledge at Strathmore — where ideas take shape and minds expand.</p>
                    <Link className="hero-btn" to="/about">Visit To Know Us</Link>
                </div>
            </section>
        </div>
    )
}
