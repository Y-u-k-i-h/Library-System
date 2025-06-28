import "./Sidebar.css";
import { useNavigate } from 'react-router-dom';
import menuIcon from "../../../assets/sidebar-assets/menuIcon.svg";
import menuFoldIcon from "../../../assets/sidebar-assets/menuFoldIcon.svg";
import menuUnfoldIcon from "../../../assets/sidebar-assets/menuUnfoldIcon.svg"
import gridIcon from "../../../assets/sidebar-assets/gridIcon.svg";
import booksIcon from "../../../assets/sidebar-assets/booksIcon.svg";
import reservedIcon from "../../../assets/sidebar-assets/reservedIcon.svg";
import moneyIcon from "../../../assets/sidebar-assets/moneyIcon.svg";
import historyIcon from "../../../assets/sidebar-assets/historyIcon.svg";
import profileIcon from "../../../assets/sidebar-assets/profileIcon.svg";
import doorIcon from "../../../assets/sidebar-assets/doorIcon.svg";
import settingsIcon from "../../../assets/sidebar-assets/settingsIcon.svg";

interface SidebarProps {
    isSidebarOpen: boolean;
    isMenuHovered: boolean;
    toggleSidebar: () => void;
    onMenuHover: () => void;
    onMenuLeave: () => void;
}

export default function Sidebar({
    isSidebarOpen,
    isMenuHovered,
    toggleSidebar,
    onMenuHover,
    onMenuLeave
}: SidebarProps) {

    const navigate = useNavigate();
    console.log(isSidebarOpen); // Debugging line to check sidebar state

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const getMenuIcon = () => {
        if (!isMenuHovered) {
            return menuIcon;
        }
        if (isSidebarOpen) {
            return menuFoldIcon;
        } else {
            return menuUnfoldIcon;
        }
    }

    return (
        <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="sidebar-contents">
               <div
                   className="menu-toggle"
                   onClick={toggleSidebar}
                   onMouseEnter={onMenuHover}
                   onMouseLeave={onMenuLeave}

               >
                   <img
                       src={getMenuIcon()}
                       alt="Menu Toggle"
                       aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                   />
                   <div className="sidebar-text">Menu</div>
               </div>

                <div className="nav-items-container">
                    <div className="nav-item" onClick={() => handleNavigation('/dashboard')}>
                        <img 
                            src={gridIcon}
                            alt="Dashboard Icon"
                            className="nav-icon"
                        />
                        <div className="nav-text">Dashboard</div>
                    </div>

                    <div className="nav-item" onClick={() => handleNavigation('/my-books')}>
                        <img 
                            src={booksIcon}
                            alt="Books Icon"
                            className="nav-icon"
                        />
                        <div className="nav-text">My Books</div>
                    </div>

                    <div className="nav-item" onClick={() => handleNavigation('/fines')}>
                        <img 
                            src={moneyIcon}
                            alt="Money Icon"
                            className="nav-icon"
                        />
                        <div className="nav-text">Fined & Fees</div>
                    </div>

                    <div className="nav-item" onClick={() => handleNavigation('/reservations')}>
                        <img 
                            src={reservedIcon}
                            alt="Reserved Icon"
                            className="nav-icon"
                        />
                        <div className="nav-text">Reserved Books</div>
                    </div>

                    <div className="nav-item" onClick={() => handleNavigation('/history')}>
                        <img 
                            src={historyIcon}
                            alt="History Icon"
                            className="nav-icon"
                        />
                        <div className="nav-text">History</div>
                    </div>
                    
                    <div className="nav-item" onClick={() => handleNavigation('/profile')}>
                        <img 
                            src={profileIcon}
                            alt="Profile Icon"
                            className="nav-icon"
                        />
                        <div className="nav-text">Profile</div>
                    </div>

                    <div className="nav-item" onClick={() => handleNavigation('/settings')}>
                        <img 
                            src={settingsIcon}
                            alt="Settings Icon"
                            className="nav-icon"
                        />
                        <div className="nav-text">Settings</div>
                    </div>

                    <div className="nav-item" onClick={handleLogout}>
                        <img 
                            src={doorIcon}
                            alt="Logout Icon"
                            className="nav-icon"
                        />
                        <div className="nav-text">Logout</div>
                    </div>

                </div>
            </div>
        </div>
    )
}
