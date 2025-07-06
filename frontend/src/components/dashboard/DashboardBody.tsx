import {useState} from "react";

import "./dashboard.css";
import Header from "./header/Header.tsx";
import Sidebar from "./sidebar/Sidebar.tsx";
import DashboardContent from "./content/DashboardContent.tsx";

export default function Dashboard() {
    // UseState to manage the sidebar toggle state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMenuHover = () => {
        setIsMenuHovered(true);
    };

    const handleMenuLeave = () => {
        setIsMenuHovered(false);
    };

    const handleFiltersChange = (filters: string[]) => {
        setAppliedFilters(filters);
    };

    // Render the dashboard with header and sidebar components
    return (
        <div className="dashboard">
            <Header
                isSidebarOpen={isSidebarOpen}
                onFiltersChange={handleFiltersChange}
            />

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                isMenuHovered={isMenuHovered}
                toggleSidebar={toggleSidebar}
                onMenuHover={handleMenuHover}
                onMenuLeave={handleMenuLeave}
            />

            <main className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <DashboardContent appliedFilters={appliedFilters} />
            </main>

        </div>
    );
}
