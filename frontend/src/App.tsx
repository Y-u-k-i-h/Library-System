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
import History from "./pages/History.tsx";
import NotificationToast from "./components/ui/NotificationToast.tsx";
import NotificationPopup from "./components/ui/NotificationPopup.tsx";
import { useNotification } from "./contexts/NotificationContext.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";

export default function App() {
    const { popupNotification, closePopup } = useNotification();
    
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
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-books" element={
                        <ProtectedRoute>
                            <MyBooksContent />
                        </ProtectedRoute>
                    } />
                    <Route path="/reservations" element={
                        <ProtectedRoute>
                            <Reserved />
                        </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NoPage />} />
                </Routes>
                <NotificationToast />
                
                {/* Global Popup Notification */}
                {popupNotification && (
                    <NotificationPopup
                        message={popupNotification.message}
                        type={popupNotification.type}
                        isVisible={true}
                        onClose={closePopup}
                        duration={4000}
                    />
                )}
            </BrowserRouter>
        </div>
    )
}
