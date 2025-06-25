interface SidebarProps {
    isSidebarOpen: boolean;
}

export default function Sidebar({isSidebarOpen}: SidebarProps) {
    return (
        <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="sidebar-top">

            </div>

            <div className="sidebar-middle">

            </div>

            <div className="sidebar-bottom">

            </div>
        </div>
    )
}
