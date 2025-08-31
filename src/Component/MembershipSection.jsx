import { Link } from "react-router-dom";
import { FaCrown, FaStar, FaGem } from "react-icons/fa";

const packages = [
  {
    name: "Silver",
    price: "$19.99",
    benefits: ["Access Upcoming Meals", "Priority Meal Request"],
    icon: <FaCrown className="text-3xl sm:text-4xl text-[#4F46E5] dark:text-indigo-300" />,
    glow: "from-[#4F46E5]/15 to-[#06B6D4]/15",
  },
  {
    name: "Gold",
    price: "$29.99",
    benefits: ["All Silver Benefits", "Faster Meal Approval", "Bonus Points"],
    icon: <FaStar className="text-3xl sm:text-4xl text-[#06B6D4] dark:text-cyan-300" />,
    glow: "from-[#06B6D4]/20 to-[#4F46E5]/20",
  },
  {
    name: "Platinum",
    price: "$49.99",
    benefits: ["All Gold Benefits", "Exclusive Dishes", "VIP Support"],
    icon: <FaGem className="text-3xl sm:text-4xl text-[#4F46E5] dark:text-indigo-300" />,
    glow: "from-[#4F46E5]/25 to-[#06B6D4]/25",
  },
];

const MembershipSection = () => {
  return (
    <section
      className="
        relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 xl:px-20
        bg-[radial-gradient(1200px_600px_at_10%_-10%,#06B6D40f,transparent_60%),radial-gradient(800px_400px_at_90%_110%,#4F46E510,transparent_60%),linear-gradient(180deg,#F8FAFC,white)]
        dark:bg-gray-900 transition-colors duration-500
        overflow-hidden
      "
      aria-labelledby="membership-title"
    >
      {/* Heading */}
      <div className="text-center mb-10 sm:mb-12 relative z-10 px-2">
        <h2
          id="membership-title"
          className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-[#1E293B] dark:text-gray-100"
        >
          Upgrade Your Experience
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-gray-300 mt-2 sm:mt-3 max-w-xl sm:max-w-2xl mx-auto">
          Choose a premium plan and unlock exclusive features
        </p>
        <span className="mt-4 inline-block h-1 w-20 sm:w-24 lg:w-28 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#4F46E5]" />
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10 max-w-6xl mx-auto relative z-10">
        {packages.map((pkg) => (
          <div key={pkg.name} className="h-full flex">
            <Link
              to={`/checkout/${pkg.name.toLowerCase()}`}
              className="
                relative flex flex-col w-full h-full rounded-2xl overflow-hidden
                p-5 sm:p-6 lg:p-8 shadow-lg bg-white/95 backdrop-blur-md
                ring-1 ring-slate-200 hover:shadow-xl
                dark:bg-gray-800 dark:ring-gray-700
                transition-transform duration-300 hover:-translate-y-1
              "
            >
              {/* Glow */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr ${pkg.glow}`}
              />

              {/* Ribbon for Gold */}
              {pkg.name === "Gold" && (
                <div className="absolute top-0 right-0 bg-[#06B6D4] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-bl-lg font-semibold shadow-md z-10">
                  Most Popular
                </div>
              )}

              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center flex-grow relative z-10">
                <div className="mb-3 sm:mb-4">{pkg.icon}</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1E293B] dark:text-white mb-1">
                  {pkg.name} Package
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-semibold text-[#4F46E5] dark:text-indigo-300 mb-4 sm:mb-5">
                  {pkg.price}
                </p>

                {/* Benefits List */}
                <ul className="text-slate-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {pkg.benefits.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 justify-center">
                      <span className="text-[#06B6D4] dark:text-cyan-300">✔</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className="
                  mt-auto w-full px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 
                  bg-[#4F46E5] hover:bg-[#06B6D4] 
                  text-white rounded-full font-medium shadow-md transition-all duration-300 relative z-10
                  dark:bg-indigo-500 dark:hover:bg-cyan-600
                "
              >
                Choose {pkg.name}
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute -bottom-32 sm:-bottom-40 -right-16 sm:-right-24 w-56 sm:w-72 lg:w-96 h-56 sm:h-72 lg:h-96 bg-gradient-to-tr from-[#4F46E5]/20 to-[#06B6D4]/20 rounded-full blur-3xl dark:from-indigo-500/20 dark:to-cyan-400/20" />
      <div className="pointer-events-none absolute -top-28 sm:-top-40 -left-16 sm:-left-24 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-gradient-to-tr from-[#06B6D4]/20 to-[#4F46E5]/20 rounded-full blur-3xl dark:from-cyan-400/20 dark:to-indigo-500/20" />
    </section>
  );
};

export default MembershipSection;
