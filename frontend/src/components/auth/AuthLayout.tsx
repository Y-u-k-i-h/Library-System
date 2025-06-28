import React from 'react';
import './AuthContainer.css';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
    return (
        <div className="auth-container">
            <div className="header">
                <div className="text-header">{title}</div>
                <div className="underline"></div>
            </div>
            {children}
        </div>
    );
}
