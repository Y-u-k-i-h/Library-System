import {useState, type ReactNode} from "react";

import "./dashboard.css";
import Header from "./header/Header.tsx";
import Sidebar from "./sidebar/Sidebar.tsx";
import DashboardContent from "./content/DashboardContent.tsx";

interface DashboardProps {
    children?: ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
    // UseState to manage the sidebar toggle state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

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

    const handleSearchChange = (search: string) => {
        setSearchTerm(search);
    };

    // Render the dashboard with header and sidebar components
    return (
        <div className="dashboard">
            <Header
                isSidebarOpen={isSidebarOpen}
                onFiltersChange={handleFiltersChange}
                onSearchChange={handleSearchChange}
            />

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                isMenuHovered={isMenuHovered}
                toggleSidebar={toggleSidebar}
                onMenuHover={handleMenuHover}
                onMenuLeave={handleMenuLeave}
            />

            <main className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                {children || <DashboardContent appliedFilters={appliedFilters} searchTerm={searchTerm} />}
            </main>

        </div>
    );
}
