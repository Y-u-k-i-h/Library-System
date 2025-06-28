import "./home.css";
import {Link} from "react-router-dom";

export default function HomeMid() {
    return (
        <div>
            <section className="what-we-offer">
                <h1>What We Offer</h1>
                <p>
                    Whether you're studying, researching, or collaborating — here's what the library offers to support your success.Explore the Resources, Spaces, and Support that make Strathmore University Library your partner in academic success.
                </p>

                <div className="row">
                    <div className="mid-col">
                        <h3>Resources</h3>
                        <p>
                            Extensive Academic Materials Gain access to a rich and diverse collection of learning materials, including textbooks, scholarly journals, past papers, theses, and digital databases. Whether you're working on assignments, research projects, or in-depth academic inquiry, our resources are curated to support both foundational learning and advanced scholarship across all disciplines.
                        </p>
                    </div>
                    <div className="mid-col">
                        <h3>Spaces</h3>
                        <p>
                            Conducive Study Environments Enjoy a variety of modern, well-designed spaces tailored to your learning style — from silent reading rooms for focused study to collaborative zones for group discussions and project work. Our library facilities are built to foster concentration and focus, comfort, and productivity, whether you’re prepping for exams or working on long-term research.
                        </p>
                    </div>
                    <div className="mid-col">
                        <h3>Support</h3>
                        <p>
                            Personalized Research & Learning Assistance Our dedicated library staff and academic support team are here to help you navigate the information landscape with confidence. From one-on-one research consultations to workshops on academic writing, referencing, and information literacy, we ensure that you’re not just accessing information — you’re learning how to use it effectively and ethically.
                        </p>
                    </div>
                </div>
            </section>

            <section className="cta">
                <h1>Your next great idea could be one click away.<br />Dive into our collection, reserve a space, or get the help you need to succeed.</h1>
                <Link to="/contact" className="hero-btn">CONTACT US</Link>
            </section>
        </div>
    )
}