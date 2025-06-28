import {Link} from "react-router-dom";
import SuLibLogo from "../../../../public/SuLogo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Footer from "./Footer.tsx";

export default function AboutComponent() {

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
                    <h1>About Us</h1>
                    <p>Learn more about our university library and our mission to support academic excellence.</p>
                </div>
            </section>

            <section className="about-details">
                <div className="container">
                    <div className="about-text">
                        <h1>Our Story</h1>
                        <p>
                            Founded in 2008 when Strathmore College became a fully chartered university, the Strathmore University Library has grown from a modest collection of textbooks into a dynamic centre for scholarship. Bearing the spirit of its 1961 roots as Kenya's first multiracial college, our library continues to welcome learners from every background, fostering a culture of inquiry and collaboration.
                        </p>

                        <h1>Our Mission</h1>
                        <p>
                            To empower Strathmore's students, faculty, and researchers by delivering inclusive, ethical, and innovative information services. We champion academic excellence through seamless access to both physical and digital resources, personalized support, and lifelong learning opportunities.
                        </p>

                        <h1>Our Vision</h1>
                        <p>
                            To be recognized as a leading academic library in Africa—where cutting‑edge technology meets human expertise, and where every member of our community can discover, create, and share knowledge that shapes tomorrow.
                        </p>
                        <a href="" className="hero-btn learn-more">Learn More</a>
                    </div>

                    <div className="about-image">
                        <img
                            src="../../../../public/Strathmore_University_Library_by_night.jpg"
                             alt="A picture of strathmore University"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}