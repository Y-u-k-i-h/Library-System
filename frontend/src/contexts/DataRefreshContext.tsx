import { createContext, useContext, useState, type ReactNode } from 'react';

interface DataRefreshContextType {
    refreshTrigger: number;
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

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const triggerBooksRefresh = () => {
        triggerRefresh();
    };

    const triggerBorrowingsRefresh = () => {
        triggerRefresh();
    };

    const triggerReservationsRefresh = () => {
        triggerRefresh();
    };

    return (
        <DataRefreshContext.Provider value={{
            refreshTrigger,
            triggerRefresh,
            triggerBooksRefresh,
            triggerBorrowingsRefresh,
            triggerReservationsRefresh
        }}>
            {children}
        </DataRefreshContext.Provider>
    );
};
