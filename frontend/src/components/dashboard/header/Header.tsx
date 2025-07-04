import {useState} from "react";

import uniLogo from "../../../assets/dashboard-assets/uniLogo.png";
import notificationIcon from "../../../assets/dashboard-assets/notification.svg";
import userPic from "../../../assets/dashboard-assets/userPic.svg";
import searchIcon from "../../../assets/dashboard-assets/search.svg";
import announcementIcon from "../../../assets/dashboard-assets/announcement.svg";
import moneyIcon from "../../../assets/dashboard-assets/money.svg";

import '../header/Header.css';

interface HeaderProps {
    isSidebarOpen: boolean;
}

const FILTER_OPTIONS = {
    bookType: [
        "Fiction",
        "Non-Fiction",
        "Textbook",
        "Research Paper",
        "Poetry",
        "Biography",
        "Atlas/Maps",
        "Children's Literature"
    ],
    subject: [
        "Maths",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
        "History",
        "Law",
        "Literature",
        "Economics",
        "Philosophy"
    ],
    availability: [
        "Available",
        "Checked Out",
        "Reserved"
    ]
};

export default function Header({isSidebarOpen}: HeaderProps) {

    {/* State to manage filter dropdown visibility and selected filters */}
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedFilterOptions, setSelectedFilterOptions] = useState<string[]>([]);

    // Handle filter changes
    const handleFilterChange = (filterValue: string) => {
        setSelectedFilterOptions( previousFilter => {
            if (previousFilter.includes(filterValue)) {
                // If the filter is already selected, remove it
                return previousFilter.filter(filterTest => filterTest !== filterValue);
            } else {
                // If the filter is not selected, add it
                return [...previousFilter, filterValue];
            }
        })
    }

    const numberOfFilters = selectedFilterOptions.length;

    const toggleFilterDropdown = () => {
        if (isFilterOpen) {
            // If the filter dropdown is open, close it
            setIsClosing(true);
            setTimeout(() => {
                setIsFilterOpen(false);
                setIsClosing(false);
            }, 500) // Adjust the timeout to match your CSS transition duration
        } else {
            // If the filter dropdown is closed, open it
            setIsFilterOpen(true);
            setIsClosing(false);
        }
    };

    const clearAllFilters = () => {
        // Clear all selected filters with animation
        setSelectedFilterOptions([]);
        setIsClosing(true);
        setTimeout(() => {
            setIsFilterOpen(false);
            setIsClosing(false);
        }, 500); // Adjust the timeout to match your CSS transition duration
    }

    {/* Render the header component */}
    return (
        <header className={`dashboard-header ${isSidebarOpen ? 'sidebar-open' : ''}`}>

            <div className="header-logo">
                <img
                    className="header-logo-img"
                    src={uniLogo}
                    alt="Strathmore University Library Logo"
                />
                <div className="header-logo-text">
                    <div className="uni-name">Strathmore University</div>
                    <div className="uni-name-lib">Library</div>
                </div>
            </div>

            {/* Center Section with Filters and Search */}
            <div className="header-center">
                {/* Filter Section Dropdown */}
                <div className="book-categories">
                    <button
                        className="filter-toggle-button"
                        onClick={toggleFilterDropdown}
                    >Applied Filters({numberOfFilters})</button>

                    {isFilterOpen && (
                        <div className={`filter-dropdown ${isClosing ? 'closing' : ''}`}>
                            <div className="filter-options">
                                <div>Book Type:</div>
                                {
                                    FILTER_OPTIONS.bookType.map(type => (
                                        <label key={type} className="filter-option">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleFilterChange(type)}
                                                checked={selectedFilterOptions.includes(type)}
                                            />
                                        {type}
                                        </label>
                                    ))
                                }
                            </div>

                            <div className="filter-options">
                                <div>Subject:</div>
                                {
                                    FILTER_OPTIONS.subject.map(subject => (
                                        <label key={subject} className="filter-option">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleFilterChange(subject)}
                                                checked={selectedFilterOptions.includes(subject)}
                                            />
                                            {subject}
                                        </label>
                                    ))
                                }
                            </div>

                            <div className="filter-options">
                                <div>Availability:</div>
                                {
                                    FILTER_OPTIONS.availability.map(status => (
                                        <label key={status} className="filter-option">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleFilterChange(status)}
                                                checked={selectedFilterOptions.includes(status)}
                                            />
                                            {status}
                                        </label>
                                    ))
                                }
                            </div>

                            <div className="filter-buttons">
                                <button className="clear-filters" onClick={clearAllFilters}>Clear All</button>
                                <button className="apply-filters">Apply Filters</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Section */}
                <div className="header-search">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for books..."
                    />
                    <button className="search-button">
                        <img
                            src={searchIcon}
                            alt="Search Icon"
                        />
                    </button>
                </div>
            </div>

            {/* Announcements, notification and User Profile Section */}
            <div className="header-right">
                <div className="announcements">
                    <div>Announcements</div>
                    <img
                        src={announcementIcon}
                        alt="Announcement Icon"
                    />
                </div>

                <div className="fine">
                    <img
                        src={moneyIcon}
                        alt="Money Icon"
                    />
                    <div>Fine</div>
                </div>

                <div className="notifications">
                    <button className="notification-button">
                        <img
                            src={notificationIcon}
                            alt="Notification Icon"
                        />
                    </button>
                </div>

                <div className="header-user">
                    <div className="profile-button">
                        <img
                            src={userPic}
                            alt="User Profile Icon"
                        />
                    </div>
                    <span>John Doe</span>
                </div>
            </div>
        </header>
    );
}
