import DashboardBody from "../components/dashboard/DashboardBody.tsx"
import AdminDashboard from "../components/admin/AdminDashboard.tsx"
import { useAuth } from "../contexts/AuthContext.tsx"

export default function Dashboard() {
    const { isLibrarian, isAuthenticated } = useAuth();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="dashboard">
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>Please log in to access the dashboard</h2>
                    <a href="/login">Go to Login</a>
                </div>
            </div>
        );
    }

    // Render admin dashboard for librarians
    if (isLibrarian) {
        return (
            <div className="dashboard admin-page">
                <AdminDashboard />
            </div>
        );
    }

    // Render student dashboard for students
    return (
        <div className="dashboard dashboard-page">
            <DashboardBody />
        </div>
    )
} 
