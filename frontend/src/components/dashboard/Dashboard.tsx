import {useState} from "react";

import "./dashboard.css";
import Header from "./header/Header.tsx";
import Sidebar from "./sidebar/Sidebar.tsx";

export default function Dashboard() {
    // UseState to manage the sidebar toggle state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMenuHovered, setIsMenuHovered] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMenuHover = () => {
        setIsMenuHovered(true);
    };

    const handleMenuLeave = () => {
        setIsMenuHovered(false);
    };

    // Render the dashboard with header and sidebar components
    return (
        <div className="dashboard">
            <Header
                isSidebarOpen={isSidebarOpen}
            />

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                isMenuHovered={isMenuHovered}
                toggleSidebar={toggleSidebar}
                onMenuHover={handleMenuHover}
                onMenuLeave={handleMenuLeave}
            />

            <main className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                {/* Your main content goes here */}
                <h1>Dashboard Content</h1>
                <p>This is where your main dashboard content will be displayed.</p>
            </main>
        </div>
    );
}
