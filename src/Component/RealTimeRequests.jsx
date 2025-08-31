import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const RealTimeRequests = () => {
  const [count, setCount] = useState(0);
  const targetCount = 1523;

  // Animate counter
  useEffect(() => {
    let start = 0;
    const duration = 2000; // total animation duration
    const increment = Math.ceil(targetCount / (duration / 50));
    const interval = setInterval(() => {
      start += increment;
      if (start >= targetCount) {
        start = targetCount;
        clearInterval(interval);
      }
      setCount(start);
    }, 50);

    return () => clearInterval(interval);
  }, [targetCount]);

  // Cancel button with SweetAlert2
  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this action?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      Swal.fire("Cancelled!", "Your action has been cancelled.", "success");
    }
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12 text-center rounded-2xl shadow-2xl mb-10 bg-white dark:bg-[#1E293B] transition-colors">
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Background Accents */}
        <div className="absolute -top-12 -left-12 w-40 sm:w-56 lg:w-72 h-40 sm:h-56 lg:h-72 bg-[#4F46E5] dark:bg-[#6366F1] opacity-10 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-44 sm:w-60 lg:w-80 h-44 sm:h-60 lg:h-80 bg-[#06B6D4] dark:bg-[#0EA5E9] opacity-10 rounded-full pointer-events-none"></div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-[#1E293B] dark:text-white drop-shadow-sm transition-colors">
          Meals Served So Far
        </h2>

        {/* Counter */}
        <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 sm:mb-3 text-[#4F46E5] dark:text-[#60A5FA] drop-shadow-lg transition-colors">
          {count.toLocaleString()}
        </p>

        <p className="text-[#1E293B] dark:text-white/80 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 transition-colors">
          And counting! Join us to enjoy your delicious meal.
        </p>

        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#06B6D4] dark:bg-[#0EA5E9] hover:bg-[#4F46E5] dark:hover:bg-[#6366F1] text-white font-semibold rounded-lg shadow-lg transition-all text-sm sm:text-base"
        >
          Cancel Action
        </button>
      </div>
    </section>
  );
};

export default RealTimeRequests;
