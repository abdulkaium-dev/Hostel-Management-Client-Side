import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    title: "Explore the Flavors of Hostel Life",
    description: "Enjoy tasty, nutritious meals every day, freshly prepared with care.",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=crop&w=2560&h=1440",
    gradient: "from-indigo-700 via-indigo-600 to-indigo-500",
  },
  {
    title: "Get Exclusive Premium Access",
    description: "Unlock upcoming meals and features with your premium badge!",
    image:
      "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?crop=entropy&cs=tinysrgb&fit=crop&w=2560&h=1440",
    gradient: "from-cyan-400 via-cyan-300 to-cyan-200",
  },
  {
    title: "Healthy & Fresh Meals",
    description: "Balanced meals every day to stay energized and focused.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=2560&h=1440",
    gradient: "from-green-400 via-green-300 to-cyan-200",
  },
];

const Slider = () => {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div
                className="w-full h-full bg-center bg-cover relative"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${slide.gradient} opacity-60`}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 text-white z-20">
                  <div className="max-w-full sm:max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug sm:leading-tight drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-md">
                      {slide.description}
                    </p>

                    {/* Search Box */}
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="flex w-full max-w-xs sm:max-w-md md:max-w-lg rounded-lg overflow-hidden bg-white/30 dark:bg-gray-800/40 backdrop-blur-md shadow-lg border border-white/30 dark:border-gray-700 mt-2 sm:mt-3"
                    >
                      <input
                        type="text"
                        placeholder="Search meals..."
                        className="flex-grow px-3 sm:px-4 md:px-5 py-2 sm:py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent outline-none text-sm sm:text-base"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 sm:px-5 md:px-6 py-2 font-medium transition text-sm sm:text-base"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
