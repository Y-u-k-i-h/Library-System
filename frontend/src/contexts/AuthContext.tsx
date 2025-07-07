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

    // Check for existing authentication on app startup
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const userRole = localStorage.getItem('userRole');
        const userCode = localStorage.getItem('userCode');
        const userName = localStorage.getItem('userName');

        if (token && userRole && userCode && userName) {
            setUser({
                token,
                role: userRole,
                userCode,
                name: userName
            });
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('jwtToken', userData.token);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userCode', userData.userCode);
        localStorage.setItem('userName', userData.name);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userCode');
        localStorage.removeItem('userName');
    };

    const isAuthenticated = !!user;
    const isLibrarian = user?.role === 'LIBRARIAN';
    const isStudent = user?.role === 'STUDENT';

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
