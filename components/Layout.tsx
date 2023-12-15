import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="bg-blue-950 min-h-screen text-gray-100 p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
            {children}
        </div>
    );
};

export default Layout;
