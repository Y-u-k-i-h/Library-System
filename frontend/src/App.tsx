import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import Login from "./pages/auth/Login.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import EnterOtp from "./pages/auth/EnterOtp.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";
import NoPage from "./pages/NoPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import MyBooksContent from "./pages/MyBooksContent.tsx";
import Reserved from "./pages/Reserved.tsx";
import NotificationToast from "./components/ui/NotificationToast.tsx";

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
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/enter-otp" element={<EnterOtp />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/my-books" element={<MyBooksContent />} />
                    <Route path="/reservations" element={<Reserved />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
                <NotificationToast />
            </BrowserRouter>
        </div>
    )
}
