import { useState, useEffect } from 'react';
import { getAllUsers, searchUsers } from '../../api/adminApi';
import type { UserSummary } from '../../api/adminApi';
import './UsersList.css';

export default function UsersList() {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserSummary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            handleSearch();
        }
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching users...');
            const usersData = await getAllUsers();
            console.log('Users fetched successfully:', usersData.length);
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
            } else if (err.response?.status === 403) {
                setError('Access denied. You do not have permission to view users.');
            } else {
                setError('Failed to fetch users. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
            return;
        }

        try {
            const searchResults = await searchUsers(searchQuery);
            setFilteredUsers(searchResults);
        } catch (err) {
            console.error('Error searching users:', err);
            // Fallback to client-side filtering if server search fails
            const clientFiltered = users.filter(user =>
                user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.userCode.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(clientFiltered);
        }
    };

    const separateUsersByRole = () => {
        const librarians = filteredUsers.filter(user => user.role === 'LIBRARIAN');
        const students = filteredUsers.filter(user => user.role === 'STUDENT');
        return { librarians, students };
    };

    const { librarians, students } = separateUsersByRole();

    const renderUserTable = (userList: UserSummary[], title: string) => {
        const isLibrarian = title === 'Librarians';
        
        return (
            <div className="user-section">
                <h3 className="section-title">{title} ({userList.length})</h3>
                {userList.length === 0 ? (
                    <div className="no-users">No {title.toLowerCase()} found</div>
                ) : (
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>User ID</th>
                                    {!isLibrarian && <th>Borrowed Books</th>}
                                    {!isLibrarian && <th>Strikes</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {userList.map(user => (
                                    <tr key={user.id} className={!isLibrarian && user.strikes > 2 ? 'high-strikes' : ''}>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td className="user-code">{user.userCode}</td>
                                        {!isLibrarian && (
                                            <td className="borrowed-count">
                                                <span className={user.borrowedBooksCount > 0 ? 'has-books' : 'no-books'}>
                                                    {user.borrowedBooksCount}
                                                </span>
                                            </td>
                                        )}
                                        {!isLibrarian && (
                                            <td className="strikes-count">
                                                <span className={`strikes ${user.strikes > 2 ? 'high' : user.strikes > 0 ? 'medium' : 'low'}`}>
                                                    {user.strikes}
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="users-list-container">
                <div className="loading">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="users-list-container">
                <div className="error">
                    {error}
                    <button onClick={fetchUsers} className="retry-button">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="users-list-container">
            <div className="users-header">
                <h2>All Users</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by name or user ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <div className="search-results-count">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </div>
            </div>

            <div className="users-content">
                {renderUserTable(librarians, 'Librarians')}
                {renderUserTable(students, 'Students')}
            </div>
        </div>
    );
}
