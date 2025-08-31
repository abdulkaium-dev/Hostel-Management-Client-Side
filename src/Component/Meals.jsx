import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Api/axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const categories = ["All", "Breakfast", "Lunch", "Dinner"];
const sortOptions = [
  { label: "Price: Low → High", value: "asc" },
  { label: "Price: High → Low", value: "desc" },
];

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const fetchMeals = async (pageNum = 1, replace = false, userToken = token) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/meals", {
        params: {
          search: search.trim() || undefined,
          category: category !== "All" ? category : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortByPrice: sortOrder || undefined,
          page: pageNum,
          limit: 6,
        },
        headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
      });

      setMeals(replace ? data.meals : (prev) => [...prev, ...data.meals]);
      setHasMore(data.meals.length === 6);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userToken = await user.getIdToken();
        setToken(userToken);
        fetchMeals(1, true, userToken);
      } else {
        setToken(null);
        fetchMeals(1, true, null);
      }
    });

    return () => unsubscribe();
  }, [search, category, minPrice, maxPrice, sortOrder]);

  const loadMore = () => {
    if (!loading && hasMore) fetchMeals(page + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 my-16">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow min-w-[160px] max-w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-24 sm:w-28 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-24 sm:w-28 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-36 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">Sort by Price</option>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition duration-300 ${
              category === cat
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 hover:bg-cyan-400/20 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <InfiniteScroll
        dataLength={meals.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4 className="text-center text-gray-500 dark:text-gray-300 mt-6">Loading more meals...</h4>}
        endMessage={
          <p className="text-center mt-6 text-gray-400 dark:text-gray-500 font-medium">
            No more meals to load.
          </p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.length === 0 && !loading && (
            <p className="text-center col-span-full text-gray-700 dark:text-gray-300 font-medium">
              No meals available in this category.
            </p>
          )}

          {meals.map((meal) => (
            <div
              key={meal._id}
              className="flex flex-col rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer bg-white dark:bg-gray-900 h-[460px]"
              onClick={() => navigate(`/meal/${meal._id}`)}
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={meal.image || "https://via.placeholder.com/400x240?text=No+Image"}
                  alt={meal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex flex-col flex-grow text-gray-900 dark:text-gray-100">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{meal.title}</h2>
                <p className="text-sm sm:text-base mt-2 line-clamp-3 text-gray-600 dark:text-gray-300">
                  {meal.description || "No description available."}
                </p>
                <p className="font-bold mt-2 text-indigo-600 dark:text-indigo-400">
                  ${meal.price?.toFixed(2) || "0.00"}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/meal/${meal._id}`);
                  }}
                  className="mt-auto bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-cyan-400 hover:text-gray-900 dark:hover:text-white py-2 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base"
                >
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Meals;
