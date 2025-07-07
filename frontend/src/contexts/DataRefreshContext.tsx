import { createContext, useContext, useState, type ReactNode } from 'react';

interface DataRefreshContextType {
    refreshTrigger: number;
    booksRefreshTrigger: number;
    borrowingsRefreshTrigger: number;
    reservationsRefreshTrigger: number;
    triggerRefresh: () => void;
    triggerBooksRefresh: () => void;
    triggerBorrowingsRefresh: () => void;
    triggerReservationsRefresh: () => void;
}

const DataRefreshContext = createContext<DataRefreshContextType | undefined>(undefined);

export const useDataRefresh = () => {
    const context = useContext(DataRefreshContext);
    if (!context) {
        throw new Error('useDataRefresh must be used within a DataRefreshProvider');
    }
    return context;
};

interface DataRefreshProviderProps {
    children: ReactNode;
}

export const DataRefreshProvider = ({ children }: DataRefreshProviderProps) => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [booksRefreshTrigger, setBooksRefreshTrigger] = useState(0);
    const [borrowingsRefreshTrigger, setBorrowingsRefreshTrigger] = useState(0);
    const [reservationsRefreshTrigger, setReservationsRefreshTrigger] = useState(0);

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const triggerBooksRefresh = () => {
        setBooksRefreshTrigger(prev => prev + 1);
        setRefreshTrigger(prev => prev + 1); // Also trigger general refresh for backward compatibility
    };

    const triggerBorrowingsRefresh = () => {
        setBorrowingsRefreshTrigger(prev => prev + 1);
    };

    const triggerReservationsRefresh = () => {
        setReservationsRefreshTrigger(prev => prev + 1);
    };

    return (
        <DataRefreshContext.Provider value={{
            refreshTrigger,
            booksRefreshTrigger,
            borrowingsRefreshTrigger,
            reservationsRefreshTrigger,
            triggerRefresh,
            triggerBooksRefresh,
            triggerBorrowingsRefresh,
            triggerReservationsRefresh
        }}>
            {children}
        </DataRefreshContext.Provider>
    );
};
