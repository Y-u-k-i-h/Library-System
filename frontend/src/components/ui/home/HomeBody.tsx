import "./home.css";
import HomeHeader from "./HomeHeader.tsx";
import HomeMid from "./HomeMid.tsx";
import Footer from "./Footer.tsx";

export default function HomeBody() {
    return (
        <div>
            <HomeHeader />
            <HomeMid />
            <Footer />
        </div>
    )
}
