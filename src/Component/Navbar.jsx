import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, [auth]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeDropdown();
      closeMobileMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const guestLinks = [
    { path: "/", label: "Home" },
    { path: "/meals", label: "Meals" },
    { path: "/join-us", label: "Join Us" },
  ];

  const userLinks = [
    { path: "/", label: "Home" },
    { path: "/meals", label: "Meals" },
    { path: "/upcoming-meals", label: "Upcoming Meals" },
    { path: "/featured", label: "Featured Meals" },
    { path: "/newsletter", label: "Newsletter" },
  ];

  const linksToRender = user ? userLinks : guestLinks;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#4F46E5] dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-white dark:text-gray-100 text-base sm:text-lg"
            onClick={closeMobileMenu}
          >
            <img
              src="data:image/jpeg;base64,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"
              alt="Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg object-contain"
            />
            <span className="whitespace-nowrap">Hostel Management</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {linksToRender.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={closeDropdown}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#06B6D4] border-b-2 border-[#06B6D4] pb-1 font-semibold"
                    : "text-white dark:text-gray-100 hover:text-[#06B6D4] transition-colors duration-300"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Menu */}
          {user && (
            <div className="hidden md:flex items-center relative">
              <button
                onClick={toggleDropdown}
                className="focus:outline-none rounded-full overflow-hidden border-2 border-[#06B6D4]"
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="User Avatar"
                  className="h-9 w-9 sm:h-10 sm:w-10 object-cover"
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 12 }} // <-- dropdown slightly lower
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-gray-100 rounded-md shadow-lg py-2 z-50"
                    onMouseLeave={closeDropdown}
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="truncate font-semibold">
                        {user.displayName || user.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={closeDropdown}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white dark:text-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#4F46E5]/95 dark:bg-gray-900 px-4 py-3 space-y-3"
          >
            {linksToRender.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => {
                  closeMobileMenu();
                  closeDropdown();
                }}
                className={({ isActive }) =>
                  isActive
                    ? "block text-[#06B6D4] border-b-2 border-[#06B6D4] pb-1 font-semibold"
                    : "block text-white dark:text-gray-100 hover:text-[#06B6D4] transition-colors duration-300 py-1"
                }
              >
                {label}
              </NavLink>
            ))}

            {user && (
              <div className="border-t border-[#06B6D4] dark:border-gray-600 pt-2 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User Avatar"
                    className="h-9 w-9 rounded-full object-cover border-2 border-[#06B6D4]"
                  />
                  <p className="text-[#1E293B] dark:text-gray-100 truncate font-medium">
                    {user.displayName || user.email}
                  </p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
