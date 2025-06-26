import "./Sidebar.css";
import menuIcon from "../../../assets/sidebar-assets/menu.svg";
import menuFoldIcon from "../../../assets/sidebar-assets/menuFold.svg";
import menuUnfoldIcon from "../../../assets/sidebar-assets/menuUnfold.svg"

interface SidebarProps {
    isSidebarOpen: boolean;
    isMenuHovered: boolean;
    toggleSidebar: () => void;
    onMenuHover: () => void;
    onMenuLeave: () => void;
}

export default function Sidebar({
    isSidebarOpen,
    isMenuHovered,
    toggleSidebar,
    onMenuHover,
    onMenuLeave
}: SidebarProps) {

    console.log(isSidebarOpen); // Debugging line to check sidebar state

    const getMenuIcon = () => {
        if (!isMenuHovered) {
            return menuIcon;
        }
        if (isSidebarOpen) {
            return menuFoldIcon;
        } else {
            return menuUnfoldIcon;
        }
    }

    return (
        <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="sidebar-contents">
               <div
                   className="menu-toggle"
                   onClick={toggleSidebar}
                   onMouseEnter={onMenuHover}
                   onMouseLeave={onMenuLeave}

               >
                   <img
                       src={getMenuIcon()}
                       alt="Menu Toggle"
                       aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                   />
                   <div className="sidebar-text">Menu</div>
               </div>


            </div>
        </div>
    )
}
