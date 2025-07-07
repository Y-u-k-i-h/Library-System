import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    userCode: string;
    name: string;
    role: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLibrarian: boolean;
    isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing authentication on app startup
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const userRole = localStorage.getItem('userRole');
                const userCode = localStorage.getItem('userCode');
                const userName = localStorage.getItem('userName');

                if (token && userRole && userCode && userName) {
                    // Optionally validate token with backend here
                    console.log('Restoring authentication from localStorage');
                    setUser({
                        token,
                        role: userRole,
                        userCode,
                        name: userName
                    });
                } else {
                    console.log('No valid authentication data found in localStorage');
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear any corrupted data
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userCode');
                localStorage.removeItem('userName');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (userData: User) => {
        console.log('Logging in user:', userData.userCode, userData.role);
        setUser(userData);
        localStorage.setItem('jwtToken', userData.token);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userCode', userData.userCode);
        localStorage.setItem('userName', userData.name);
    };

    const logout = () => {
        console.log('Logging out user');
        setUser(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userCode');
        localStorage.removeItem('userName');
    };

    const isAuthenticated = !!user && !isLoading;
    const isLibrarian = user?.role === 'LIBRARIAN';
    const isStudent = user?.role === 'STUDENT';

    // Don't render children until auth is initialized
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '16px',
                color: '#666'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated,
            isLibrarian,
            isStudent
        }}>
            {children}
        </AuthContext.Provider>
    );
};
