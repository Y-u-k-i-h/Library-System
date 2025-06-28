import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import NoPage from "./pages/NoPage.tsx";

export default function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path ="/home" element={<Home />} />
                    <Route path ="/about" element={<About />} />
                    <Route path ="/contact" element={<Contact />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
