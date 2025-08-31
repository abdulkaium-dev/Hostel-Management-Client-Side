import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 sm:py-16 px-4 sm:px-8 lg:px-20 overflow-hidden transition-colors duration-300">
      {/* Floating Background Circles */}
      <div className="absolute -top-16 -left-16 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-600/20 dark:bg-indigo-400/20 rounded-full blur-3xl animate-slow-spin pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-52 h-52 sm:w-64 sm:h-64 bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-3xl animate-slow-spin-reverse pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <span className="text-2xl font-bold tracking-wide text-indigo-600 dark:text-indigo-400">
              Hostel Meals
            </span>
          </div>
          <p className="max-w-sm opacity-80 text-sm sm:text-base">
            Delicious and nutritious meals served fresh daily to university hostel students. Join us and enjoy the best dining experience.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 border-b-2 border-cyan-400 dark:border-cyan-600 pb-1 inline-block">
            Quick Links
          </h3>
          <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            {[
              { name: "Home", href: "/" },
              { name: "Meals", href: "/meals" },
              { name: "Upcoming Meals", href: "/upcoming-meals" },
              { name: "Join Us", href: "/join-us" },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 border-b-2 border-cyan-400 dark:border-cyan-600 pb-1 inline-block">
            Contact Us
          </h3>
          <p className="opacity-80 mb-1 text-sm sm:text-base">University Hostel Office</p>
          <p className="opacity-80 mb-1 text-sm sm:text-base">Email: support@hostelmeals.com</p>
          <p className="opacity-80 mb-3 text-sm sm:text-base">Phone: +880 1234 567 890</p>

          <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 sm:p-3 rounded-full bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 hover:bg-cyan-400 dark:hover:bg-cyan-600 hover:text-gray-900 dark:hover:text-gray-100 shadow-md sm:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Icon className="text-xs sm:text-sm" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-cyan-400/30 dark:border-cyan-600/30 my-6 sm:my-8 transition-colors duration-300" />

      {/* Copyright */}
      <p className="text-center opacity-60 text-xs sm:text-sm select-none">
        &copy; {new Date().getFullYear()} HostelMeals. All rights reserved.
      </p>

      {/* Animations */}
      <style>{`
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slow-spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 60s linear infinite;
        }
        .animate-slow-spin-reverse {
          animation: slow-spin-reverse 80s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
