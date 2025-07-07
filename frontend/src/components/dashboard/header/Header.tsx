import {useState} from "react";

import uniLogo from "../../../assets/dashboard-assets/uniLogo.png";
import userPic from "../../../assets/dashboard-assets/userPic.svg";
import searchIcon from "../../../assets/dashboard-assets/search.svg";
import announcementIcon from "../../../assets/dashboard-assets/announcement.svg";
import moneyIcon from "../../../assets/dashboard-assets/money.svg";
import NotificationDropdown from "../../ui/NotificationDropdown";

import '../header/Header.css';

interface HeaderProps {
    isSidebarOpen: boolean;
    onFiltersChange?: (filters: string[]) => void;
    onSearchChange?: (searchTerm: string) => void;
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

export default function Header({isSidebarOpen, onFiltersChange, onSearchChange}: HeaderProps) {

    {/* State to manage filter dropdown visibility and selected filters */}
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedFilterOptions, setSelectedFilterOptions] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

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

    const applyFilters = () => {
        if (onFiltersChange) {
            onFiltersChange(selectedFilterOptions);
        }
        setIsClosing(true);
        setTimeout(() => {
            setIsFilterOpen(false);
            setIsClosing(false);
        }, 500);
    }

    const clearAllFilters = () => {
        setSelectedFilterOptions([]);
        if (onFiltersChange) {
            onFiltersChange([]);
        }
        setIsClosing(true);
        setTimeout(() => {
            setIsFilterOpen(false);
            setIsClosing(false);
        }, 500);
    }

    // Handle search functionality
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        if (onSearchChange) {
            onSearchChange(newSearchTerm);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearchChange) {
            onSearchChange(searchTerm);
        }
    };

    const handleSearchClick = () => {
        if (onSearchChange) {
            onSearchChange(searchTerm);
        }
    };

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
                                <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Section */}
                <div className="header-search">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by book title or author..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button type="button" className="search-button" onClick={handleSearchClick}>
                            <img
                                src={searchIcon}
                                alt="Search Icon"
                            />
                        </button>
                    </form>
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
                    <NotificationDropdown />
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
