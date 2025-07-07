import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>📚 Library Admin</h2>
                <nav>
                    <ul>
                        <li>🏠 Dashboard</li>
                        <li>👥 Users</li>
                        <li>📚 Books</li>
                        <li>🔄 Borrowing</li>
                        <li>💳 Payments</li>
                        <li>💬 Feedback</li>
                        <li>📢 Announcements</li>
                        <li>⚙️ Settings</li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className="main-content">
                {/* Topbar */}
                <div className="topbar">
                    <span>Welcome, {user?.name || 'Admin'} | <strong>Librarian Portal</strong></span>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>

                {/* Dashboard */}
                <div className="dashboard-content">
                    <h1>Dashboard</h1>

                    <div className="stats-cards">
                        <div className="stat-card">
                            <h3>Total Users</h3>
                            <p>152</p>
                        </div>
                        <div className="stat-card">
                            <h3>Books Available</h3>
                            <p>843</p>
                        </div>
                        <div className="stat-card">
                            <h3>Pending Borrowings</h3>
                            <p>19</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Fines</h3>
                            <p>KES 13,240</p>
                        </div>
                    </div>

                    <div className="recent-activity">
                        <h3>Recent Activity</h3>
                        <ul>
                            <li>John borrowed "Java Basics" on 25 Jun</li>
                            <li>Mary paid fine KES 500 on 24 Jun</li>
                            <li>System updated to version 2.0</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
