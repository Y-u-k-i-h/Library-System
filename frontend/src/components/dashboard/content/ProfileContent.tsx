import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserProfile, getCurrentUserProfileFromStorage, type UserProfile } from '../../../api/authApi';
import './ProfileContent.css';

interface ProfileContentProps {
    // No search functionality needed for profile
}

export default function ProfileContent({}: ProfileContentProps) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            try {
                // Try to get full profile from API
                const profile = await getCurrentUserProfile();
                console.log('=== USER PROFILE SUCCESS ===');
                console.log('Full profile data:', profile);
                console.log('User ID:', profile.id);
                console.log('User_ID field:', profile.user_id);
                console.log('User Code:', profile.userCode);
                console.log('First Name:', profile.fname);
                console.log('Last Name:', profile.lname);
                console.log('Email:', profile.email);
                console.log('Phone:', profile.phone);
                console.log('Role:', profile.role);
                console.log('=== END PROFILE DATA ===');
                setUserProfile(profile);
            } catch (apiError: any) {
                console.log('API failed, trying fallback from localStorage...');
                
                // Fallback to localStorage data
                const storageProfile = getCurrentUserProfileFromStorage();
                console.log('User profile from storage:', storageProfile);
                
                // Convert partial profile to full profile with defaults
                const fallbackProfile: UserProfile = {
                    id: 0,
                    user_id: storageProfile.user_id || 0,
                    userCode: storageProfile.userCode || '',
                    fname: storageProfile.fname || '',
                    lname: storageProfile.lname || '',
                    email: 'Not available',
                    phone: 0,
                    role: storageProfile.role || 'student'
                };
                
                setUserProfile(fallbackProfile);
            }
        } catch (err: any) {
            console.error("Error fetching user profile:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch user profile";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleViewHistory = () => {
        navigate('/history');
    };

    const getInitials = (fname: string, lname: string) => {
        return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <p>View and manage your profile information</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p className="error-message">Error: {error}</p>
                    <button 
                        className="retry-button" 
                        onClick={fetchUserProfile}
                    >
                        Try Again
                    </button>
                </div>
            ) : userProfile ? (
                <div className="profile-content">
                    <div className="profile-card glowing-card">
                        <div className="profile-avatar">
                            <div className="avatar-circle">
                                {getInitials(userProfile.fname, userProfile.lname)}
                            </div>
                        </div>
                        
                        <div className="profile-info">
                            <h2 className="profile-name">
                                {userProfile.fname} {userProfile.lname}
                            </h2>
                            
                            <div className="profile-details">
                                <div className="detail-item">
                                    <span className="detail-label">Student ID:</span>
                                    <span className="detail-value">{userProfile.userCode}</span>
                                </div>
                                
                                <div className="detail-item">
                                    <span className="detail-label">Email:</span>
                                    <span className="detail-value">{userProfile.email}</span>
                                </div>
                                
                                <div className="detail-item">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">{userProfile.phone}</span>
                                </div>
                                
                                <div className="detail-item">
                                    <span className="detail-label">Role:</span>
                                    <span className="detail-value role-badge">{userProfile.role}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="profile-actions">
                            <button 
                                className="history-button"
                                onClick={handleViewHistory}
                            >
                                <svg className="history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                    <path d="M3 3v5h5"/>
                                    <path d="M12 7v5l4 2"/>
                                </svg>
                                View Borrowing History
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="no-profile">
                    <p>No profile information available</p>
                </div>
            )}
        </div>
    );
}
