import React from 'react';
import Sidebar from './Sidebar';
import Player from './Player';

const Layout = ({ children }) => {
    return (
        <div className="h-dvh flex flex-col p-4 gap-4 box-border">
            <div className="flex-1 flex overflow-hidden relative gap-6">
                <Sidebar />
                <div className="flex-1 w-full h-full overflow-hidden flex flex-col glass-panel shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    {children}
                </div>
            </div>
            <Player />
        </div>
    );
};

export default Layout;
