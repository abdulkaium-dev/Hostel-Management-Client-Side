import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  getIdToken,
} from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../Api/axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  // Firebase Authentication + MongoDB Role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);
      setDropdownOpen(false);

      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);

          const { data } = await axiosInstance.get(
            `/users/${encodeURIComponent(currentUser.email)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUserRole(data.role || "user");
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setUserRole("user");
        }
      } else {
        setUserRole("user");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      setUser(null);
      setUserRole("user");

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

  const dashboardLabel =
    userRole === "admin" ? "Admin Dashboard" : "User Dashboard";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#1E3A8A] dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-white dark:text-gray-100 text-base sm:text-lg"
            onClick={closeMobileMenu}
          >
            <img
              src="https://i.ibb.co/bgxs7zCF/930401700.jpg"
              alt="Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg object-contain"
            />

            <span className="whitespace-nowrap">
              Hostel Food Service Hub
            </span>
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

          {/* Desktop User Menu - No Profile Photo */}
          {user && (
            <div className="hidden md:flex items-center relative">
              <button
                onClick={toggleDropdown}
                className="px-4 py-2 rounded-lg border border-[#06B6D4] text-white hover:bg-[#06B6D4] hover:text-gray-900 transition font-medium"
              >
                {userRole === "admin" ? "Admin" : "My Account"} ▾
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 12 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-gray-100 rounded-md shadow-lg py-2 z-50"
                    onMouseLeave={closeDropdown}
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="truncate font-semibold">
                        {user.displayName || user.email}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">
                        {userRole}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={closeDropdown}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      {dashboardLabel}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
              <div className="border-t border-[#06B6D4] dark:border-gray-600 pt-3 space-y-2">

                {/* User Information - No Photo */}
                <div className="px-3 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
                  <p className="text-[#1E293B] dark:text-gray-100 truncate font-semibold">
                    {user.displayName || user.email}
                  </p>

                  <p className="text-sm text-indigo-600 dark:text-cyan-400 capitalize mt-1">
                    {userRole}
                  </p>
                </div>

                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                >
                  {dashboardLabel}
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



// import React, { useState, useEffect } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { motion, AnimatePresence } from "framer-motion";

// const Navbar = () => {
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const auth = getAuth();

//   // Listen to auth changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null);
//     });
//     return () => unsubscribe();
//   }, [auth]);

//   // Lock scroll when mobile menu open
//   useEffect(() => {
//     document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
//   }, [mobileMenuOpen]);

//   const toggleDropdown = () => setDropdownOpen((prev) => !prev);
//   const closeDropdown = () => setDropdownOpen(false);
//   const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
//   const closeMobileMenu = () => setMobileMenuOpen(false);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       closeDropdown();
//       closeMobileMenu();
//       navigate("/");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   const guestLinks = [
//     { path: "/", label: "Home" },
//     { path: "/meals", label: "Meals" },
//     { path: "/join-us", label: "Join Us" },
//   ];

//   const userLinks = [
//     { path: "/", label: "Home" },
//     { path: "/meals", label: "Meals" },
//     { path: "/upcoming-meals", label: "Upcoming Meals" },
//     { path: "/featured", label: "Featured Meals" },
//     { path: "/newsletter", label: "Newsletter" },
//   ];

//   const linksToRender = user ? userLinks : guestLinks;

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-[#1E3A8A] dark:bg-gray-900 shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link
//             to="/"
//             className="flex items-center gap-2 font-bold text-white dark:text-gray-100 text-base sm:text-lg"
//             onClick={closeMobileMenu}
//           >
// <img
//   src="https://i.ibb.co/bgxs7zCF/930401700.jpg"
//   alt="Logo"
//   className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg object-contain"
// />
//             <span className="whitespace-nowrap">Hostel Food Service Hub</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-6">
//             {linksToRender.map(({ path, label }) => (
//               <NavLink
//                 key={path}
//                 to={path}
//                 onClick={closeDropdown}
//                 className={({ isActive }) =>
//                   isActive
//                     ? "text-[#06B6D4] border-b-2 border-[#06B6D4] pb-1 font-semibold"
//                     : "text-white dark:text-gray-100 hover:text-[#06B6D4] transition-colors duration-300"
//                 }
//               >
//                 {label}
//               </NavLink>
//             ))}
//           </div>

//           {/* Desktop User Menu */}
//           {user && (
//             <div className="hidden md:flex items-center relative">
//               <button
//                 onClick={toggleDropdown}
//                 className="focus:outline-none rounded-full overflow-hidden border-2 border-[#06B6D4]"
//               >
//                 <img
//                   src={user.photoURL || "/default-avatar.png"}
//                   alt="User Avatar"
//                   className="h-9 w-9 sm:h-10 sm:w-10 object-cover"
//                 />
//               </button>

//               <AnimatePresence>
//                 {dropdownOpen && (
//                   <motion.div
//                     key="dropdown"
//                     initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                     animate={{ opacity: 1, scale: 1, y: 12 }} // <-- dropdown slightly lower
//                     exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-gray-100 rounded-md shadow-lg py-2 z-50"
//                     onMouseLeave={closeDropdown}
//                   >
//                     <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                       <p className="truncate font-semibold">
//                         {user.displayName || user.email}
//                       </p>
//                     </div>
//                     <Link
//                       to="/dashboard"
//                       onClick={closeDropdown}
//                       className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                     >
//                       Dashboard
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                     >
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}

//           {/* Mobile Hamburger */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMobileMenu}
//               className="text-white dark:text-gray-100 focus:outline-none"
//             >
//               {mobileMenuOpen ? (
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             key="mobileMenu"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.2 }}
//             className="md:hidden bg-[#4F46E5]/95 dark:bg-gray-900 px-4 py-3 space-y-3"
//           >
//             {linksToRender.map(({ path, label }) => (
//               <NavLink
//                 key={path}
//                 to={path}
//                 onClick={() => {
//                   closeMobileMenu();
//                   closeDropdown();
//                 }}
//                 className={({ isActive }) =>
//                   isActive
//                     ? "block text-[#06B6D4] border-b-2 border-[#06B6D4] pb-1 font-semibold"
//                     : "block text-white dark:text-gray-100 hover:text-[#06B6D4] transition-colors duration-300 py-1"
//                 }
//               >
//                 {label}
//               </NavLink>
//             ))}

//             {user && (
//               <div className="border-t border-[#06B6D4] dark:border-gray-600 pt-2 space-y-2">
//                 <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
//                   <img
//                     src={user.photoURL || "/default-avatar.png"}
//                     alt="User Avatar"
//                     className="h-9 w-9 rounded-full object-cover border-2 border-[#06B6D4]"
//                   />
//                   <p className="text-[#1E293B] dark:text-gray-100 truncate font-medium">
//                     {user.displayName || user.email}
//                   </p>
//                 </div>
//                 <Link
//                   to="/dashboard"
//                   onClick={closeMobileMenu}
//                   className="block px-3 py-2 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
//                 >
//                   Dashboard
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;



