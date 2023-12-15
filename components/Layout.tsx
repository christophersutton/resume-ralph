import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="bg-slate-900 text-slate-400 min-h-screen p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
            {children}
        </div>
    );
};

export default Layout;
