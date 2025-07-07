import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UsersList from './UsersList';
import BorrowedBooksLedger from './BorrowedBooksLedger';
import ReservedBooksList from './ReservedBooksList';
import './AdminDashboard.css';

// Import icons (reusing existing sidebar icons)
import menuIcon from "../../assets/sidebar-assets/menuIcon.svg";
import menuFoldIcon from "../../assets/sidebar-assets/menuFoldIcon.svg";
import menuUnfoldIcon from "../../assets/sidebar-assets/menuUnfoldIcon.svg";
import profileIcon from "../../assets/sidebar-assets/profileIcon.svg";
import booksIcon from "../../assets/sidebar-assets/booksIcon.svg";
import reservedIcon from "../../assets/sidebar-assets/reservedIcon.svg";
import historyIcon from "../../assets/sidebar-assets/historyIcon.svg";
import doorIcon from "../../assets/sidebar-assets/doorIcon.svg";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const [activeSection, setActiveSection] = useState('total-users');

    const handleLogout = useCallback(() => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            logout();
            navigate('/login');
        }
    }, [logout, navigate]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    const onMenuHover = useCallback(() => {
        setIsMenuHovered(true);
    }, []);

    const onMenuLeave = useCallback(() => {
        setIsMenuHovered(false);
    }, []);

    const getMenuIcon = useMemo(() => {
        if (!isMenuHovered) {
            return menuIcon;
        }
        if (isSidebarOpen) {
            return menuFoldIcon;
        } else {
            return menuUnfoldIcon;
        }
    }, [isMenuHovered, isSidebarOpen]);

    const handleSectionChange = useCallback((section: string) => {
        setActiveSection(section);
    }, []);

    return (
        <div className="admin-dashboard-container">
            {/* Admin Sidebar */}
            <div className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="sidebar-contents">
                    <div
                        className="menu-toggle"
                        onClick={toggleSidebar}
                        onMouseEnter={onMenuHover}
                        onMouseLeave={onMenuLeave}
                        data-tooltip="Menu"
                    >
                        <img
                            src={getMenuIcon}
                            alt="Menu Toggle"
                            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                        />
                        <div className="sidebar-text">Admin Menu</div>
                    </div>

                    <div className="nav-items-container">
                        <div 
                            className={`nav-item ${activeSection === 'total-users' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('total-users')} 
                            data-tooltip="Total Users"
                        >
                            <img src={profileIcon} alt="Users Icon" className="nav-icon" />
                            <div className="nav-text">Total Users</div>
                        </div>

                        <div 
                            className={`nav-item ${activeSection === 'borrowed-ledger' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('borrowed-ledger')} 
                            data-tooltip="Books Borrowed Ledger"
                        >
                            <img src={historyIcon} alt="Ledger Icon" className="nav-icon" />
                            <div className="nav-text">Borrowed Ledger</div>
                        </div>

                        <div 
                            className={`nav-item ${activeSection === 'reserved-books' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('reserved-books')} 
                            data-tooltip="Reserved Books List"
                        >
                            <img src={reservedIcon} alt="Reserved Icon" className="nav-icon" />
                            <div className="nav-text">Reserved Books</div>
                        </div>

                        <div 
                            className={`nav-item ${activeSection === 'users-with-books' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('users-with-books')} 
                            data-tooltip="Users with Borrowed Books"
                        >
                            <img src={booksIcon} alt="Books Icon" className="nav-icon" />
                            <div className="nav-text">Users with Books</div>
                        </div>

                        <div className="nav-item logout-item" onClick={handleLogout} data-tooltip="Logout">
                            <img src={doorIcon} alt="Logout Icon" className="nav-icon" />
                            <div className="nav-text">Logout</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`admin-main-content ${isSidebarOpen ? 'content-expanded' : 'content-full'}`}>
                <div className="admin-header">
                    <h1>Library Administration</h1>
                    <div className="admin-user-info">
                        <span>Welcome, {user?.name || 'Admin'}</span>
                        <span className="role-badge">Librarian</span>
                    </div>
                </div>

                <div className="admin-content">
                    {activeSection === 'total-users' && (
                        <div className="admin-section">
                            <h2>Total Users</h2>
                            <p>Manage and view all registered users in the system.</p>
                            <UsersList />
                        </div>
                    )}

                    {activeSection === 'borrowed-ledger' && (
                        <div className="admin-section">
                            <h2>Books Borrowed Ledger</h2>
                            <p>Track all borrowed books and their return status.</p>
                            <BorrowedBooksLedger />
                        </div>
                    )}

                    {activeSection === 'reserved-books' && (
                        <div className="admin-section">
                            <h2>Reserved Books List</h2>
                            <p>View and manage all book reservations.</p>
                            <ReservedBooksList />
                        </div>
                    )}

                    {activeSection === 'users-with-books' && (
                        <div className="admin-section">
                            <h2>Users with Borrowed Books</h2>
                            <p>View users who currently have borrowed books.</p>
                            {/* Content will be implemented later */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
