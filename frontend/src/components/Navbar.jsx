import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, Globe, Menu, User, ChevronLeft, ChevronRight, Plus, Minus, X } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  
  // Show large navbar on home page when not scrolled
  const showLargeNavbar = isHomePage && !scrolled;

  // Search functionality state
  const [activeSection, setActiveSection] = useState(null);
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: null,
    checkOut: null,
    guests: {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0
    }
  });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  // Refs for click outside detection
  const searchRef = useRef(null);

  // Popular destinations for search suggestions
  const popularDestinations = [
    { name: "Dhaka, Bangladesh", subtitle: "Capital city", icon: "🏙️" },
    { name: "Chittagong, Bangladesh", subtitle: "Port city", icon: "🚢" },
    { name: "Sylhet, Bangladesh", subtitle: "Tea gardens", icon: "🍃" },
    { name: "Cox's Bazar, Bangladesh", subtitle: "Beach resort", icon: "🏖️" },
    { name: "Kuala Lumpur, Malaysia", subtitle: "Modern metropolis", icon: "🏙️" },
    { name: "Bangkok, Thailand", subtitle: "Cultural hub", icon: "🏛️" },
    { name: "Singapore", subtitle: "City-state", icon: "🌆" },
    { name: "Jakarta, Indonesia", subtitle: "Bustling capital", icon: "🏙️" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setActiveSection(null);
      }
      // Close user menu when clicking outside
      if (showUserMenu && !event.target.closest('.relative')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Authentication modal handlers
  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const handleOpenRegister = () => {
    setShowRegisterModal(true);
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  // Helper functions
  const generateCalendarDays = (month) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow past dates
    if (date < today) return;

    if (!selectingCheckOut && !searchData.checkIn) {
      setSearchData(prev => ({ ...prev, checkIn: date }));
      setSelectingCheckOut(true);
    } else if (selectingCheckOut && searchData.checkIn) {
      if (date > searchData.checkIn) {
        setSearchData(prev => ({ ...prev, checkOut: date }));
        setSelectingCheckOut(false);
        setActiveSection(null);
      } else {
        setSearchData(prev => ({ ...prev, checkIn: date, checkOut: null }));
        setSelectingCheckOut(true);
      }
    }
  };

  const updateGuestCount = (type, operation) => {
    setSearchData(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: operation === 'increment' 
          ? prev.guests[type] + 1 
          : Math.max(type === 'adults' ? 1 : 0, prev.guests[type] - 1)
      }
    }));
  };

  const getTotalGuests = () => {
    return searchData.guests.adults + searchData.guests.children;
  };

  const handleDestinationSelect = (destination) => {
    setSearchData(prev => ({ ...prev, destination: destination.name }));
    setActiveSection(null);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (searchData.destination) {
      searchParams.set('location', searchData.destination);
    }
    
    if (searchData.checkIn) {
      searchParams.set('checkIn', searchData.checkIn.toISOString().split('T')[0]);
    }
    
    if (searchData.checkOut) {
      searchParams.set('checkOut', searchData.checkOut.toISOString().split('T')[0]);
    }
    
    const totalGuests = getTotalGuests();
    if (totalGuests > 0) {
      searchParams.set('guests', totalGuests.toString());
    }

    // Navigate to search results page
    navigate(`/search?${searchParams.toString()}`);
    setActiveSection(null);
  };

  const clearDates = () => {
    setSearchData(prev => ({ ...prev, checkIn: null, checkOut: null }));
    setSelectingCheckOut(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-1000 bg-white transition-all duration-300 border-b border-gray-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link to={"/"} className="flex items-center">
          <img src="/aircnc.png" alt="Aircnc" className="h-6 sm:h-8 w-auto" />
        </Link>

        {/* Search Bar - Compact version for non-home pages or when scrolled */}
        {(!showLargeNavbar) && (
          <div className="flex-1 max-w-md mx-2 sm:mx-8">
            <div className="flex items-center bg-white border border-gray-300 rounded-full py-2 px-3 sm:px-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex-1 text-xs sm:text-sm">
                <span className="text-gray-900 font-medium">
                  {searchData.destination || 'Anywhere'}
                </span>
                <span className="text-gray-400 mx-1 sm:mx-2 hidden sm:inline">•</span>
                <span className="text-gray-600 hidden sm:inline">
                  {searchData.checkIn && searchData.checkOut 
                    ? `${formatDate(searchData.checkIn)} - ${formatDate(searchData.checkOut)}`
                    : 'Any week'
                  }
                </span>
                <span className="text-gray-400 mx-1 sm:mx-2">•</span>
                <span className="text-gray-600">
                  {getTotalGuests() > 0 ? `${getTotalGuests()} guests` : 'Add guests'}
                </span>
              </div>
              <div className="bg-red-500 p-1.5 sm:p-2 rounded-full ml-2">
                <Search className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Right side navigation */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="hidden sm:block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full text-sm font-medium">
            Airbnb your home
          </button>
          <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full">
            <Globe className="w-4 h-4" />
          </button>
          <div className="relative">
            <button 
              className="flex items-center border border-gray-300 rounded-full py-1 px-2 hover:shadow-md transition-shadow"
              onClick={() => {
                if (window.innerWidth < 640) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  setShowUserMenu(!showUserMenu);
                }
              }}
            >
              <Menu className="w-4 h-4 mx-1 sm:mx-2" />
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden">
                {isAuthenticated && user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.firstName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
              </div>
            </button>

            {/* Desktop User Menu */}
            {showUserMenu && (
              <div className="hidden sm:block absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Dashboard
                    </button>
                    {user?.isHost && (
                      <button 
                        onClick={() => {
                          navigate('/dashboard/profile-switcher');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile Switcher
                      </button>
                    )}
               
                    {!user?.isHost && (
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Aircnc your home
                      </button>
                    )}
                    <hr className="my-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleOpenLogin}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </button>
                    <button 
                      onClick={handleOpenRegister}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign up
                    </button>
                    <hr className="my-2" />
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Aircnc your home
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Help Center
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Large Search Bar - Only shown on home page when not scrolled and not on mobile */}
      {showLargeNavbar && (
        <div className="pb-6 hidden sm:block">
          <div className="flex justify-center px-4">
            <div 
              ref={searchRef}
              className="flex items-center bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow relative max-w-4xl w-full"
            >
              {/* Where section */}
              <div 
                className={`flex-1 px-6 py-4 cursor-pointer rounded-full transition-colors ${
                  activeSection === 'where' ? 'bg-white shadow-lg' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(activeSection === 'where' ? null : 'where')}
              >
                <div className="text-xs font-semibold text-gray-900 mb-1">Where</div>
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={searchData.destination}
                  onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))}
                  className="text-gray-600 text-sm bg-transparent border-none outline-none w-full placeholder-gray-400"
                />
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Check in section */}
              <div 
                className={`px-6 py-4 cursor-pointer transition-colors ${
                  activeSection === 'checkin' ? 'bg-white shadow-lg rounded-full' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(activeSection === 'checkin' ? null : 'checkin')}
              >
                <div className="text-xs font-semibold text-gray-900 mb-1">Check in</div>
                <div className="text-gray-600 text-sm">
                  {searchData.checkIn ? formatDate(searchData.checkIn) : 'Add dates'}
                </div>
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Check out section */}
              <div 
                className={`px-6 py-4 cursor-pointer transition-colors ${
                  activeSection === 'checkout' ? 'bg-white shadow-lg rounded-full' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(activeSection === 'checkout' ? null : 'checkout')}
              >
                <div className="text-xs font-semibold text-gray-900 mb-1">Check out</div>
                <div className="text-gray-600 text-sm">
                  {searchData.checkOut ? formatDate(searchData.checkOut) : 'Add dates'}
                </div>
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Guests section */}
              <div 
                className={`px-6 py-4 cursor-pointer transition-colors ${
                  activeSection === 'guests' ? 'bg-white shadow-lg rounded-full' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(activeSection === 'guests' ? null : 'guests')}
              >
                <div className="text-xs font-semibold text-gray-900 mb-1">Who</div>
                <div className="text-gray-600 text-sm">
                  {getTotalGuests() > 0 ? `${getTotalGuests()} guests` : 'Add guests'}
                </div>
              </div>

              {/* Search button */}
              <button 
                onClick={handleSearch}
                className="bg-red-500 hover:bg-red-600 p-4 rounded-full ml-2 mr-2 transition-colors"
              >
                <Search className="w-4 h-4 text-white" />
              </button>

              {/* Dropdown panels */}
              {activeSection === 'where' && (
                <div className="absolute top-full left-0 mt-3 bg-white border border-gray-200 rounded-3xl shadow-xl p-6 w-96 z-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Popular destinations</h3>
                  <div className="space-y-2">
                    {popularDestinations.map((destination, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer"
                        onClick={() => handleDestinationSelect(destination)}
                      >
                        <div className="text-2xl">{destination.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{destination.name}</div>
                          <div className="text-xs text-gray-500">{destination.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeSection === 'checkin' || activeSection === 'checkout') && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-white border border-gray-200 rounded-3xl shadow-xl p-6 w-96 z-50">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays(currentMonth).map((date, index) => {
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isPast = date < new Date();
                      const isSelected = (searchData.checkIn && date.toDateString() === searchData.checkIn.toDateString()) ||
                                       (searchData.checkOut && date.toDateString() === searchData.checkOut.toDateString());
                      const isInRange = searchData.checkIn && searchData.checkOut && 
                                       date > searchData.checkIn && date < searchData.checkOut;

                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(date)}
                          disabled={isPast}
                          className={`
                            w-10 h-10 rounded-full text-sm transition-colors
                            ${!isCurrentMonth ? 'text-gray-300' : ''}
                            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                            ${isToday ? 'bg-gray-900 text-white' : ''}
                            ${isSelected ? 'bg-red-500 text-white' : ''}
                            ${isInRange ? 'bg-red-100' : ''}
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {(searchData.checkIn || searchData.checkOut) && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <button
                        onClick={clearDates}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                      >
                        Clear dates
                      </button>
                      <div className="text-sm text-gray-900">
                        {searchData.checkIn && searchData.checkOut 
                          ? `${formatDate(searchData.checkIn)} - ${formatDate(searchData.checkOut)}`
                          : selectingCheckOut ? 'Select checkout date' : 'Select checkin date'
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'guests' && (
                <div className="absolute top-full right-0 mt-3 bg-white border border-gray-200 rounded-3xl shadow-xl p-6 w-96 z-50">
                  <div className="space-y-4">
                    {[
                      { key: 'adults', label: 'Adults', description: 'Ages 13 or above' },
                      { key: 'children', label: 'Children', description: 'Ages 2-12' },
                      { key: 'infants', label: 'Infants', description: 'Under 2' },
                      { key: 'pets', label: 'Pets', description: 'Bringing a service animal?' }
                    ].map((guestType) => (
                      <div key={guestType.key} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{guestType.label}</div>
                          <div className="text-xs text-gray-500">{guestType.description}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateGuestCount(guestType.key, 'decrement')}
                            disabled={guestType.key === 'adults' ? searchData.guests[guestType.key] <= 1 : searchData.guests[guestType.key] <= 0}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:hover:border-gray-300 disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {searchData.guests[guestType.key]}
                          </span>
                          <button
                            onClick={() => updateGuestCount(guestType.key, 'increment')}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3"
                >
                  Profile
                </button>
                <button 
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3"
                >
                  Dashboard
                </button>
                {user?.isHost && (
                  <button 
                    onClick={() => {
                      navigate('/dashboard/profile-switcher');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3"
                  >
                    Profile Switcher
                  </button>
                )}
                <button className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3">
                  Account
                </button>
                <button className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3">
                  Trips
                </button>
                <button className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3">
                  Wishlists
                </button>
                {!user?.isHost && (
                  <button className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3">
                    Aircnc your home
                  </button>
                )}
                <button className="flex items-center w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3">
                  <Globe className="w-4 h-4 mr-3" />
                  Language and region
                </button>
                <hr className="border-gray-200" />
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleOpenLogin}
                  className="block w-full text-left py-2 font-medium text-gray-900 hover:bg-gray-100 rounded-lg px-3"
                >
                  Log in
                </button>
                <button 
                  onClick={handleOpenRegister}
                  className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3"
                >
                  Sign up
                </button>
                <hr className="border-gray-200" />
                <button className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3">
                  Aircnc your home
                </button>
                <button className="flex items-center w-full text-left py-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3">
                  <Globe className="w-4 h-4 mr-3" />
                  Language and region
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Authentication Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
}