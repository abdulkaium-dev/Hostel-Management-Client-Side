import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { motion, useAnimation } from "framer-motion";
import { AuthContext } from "../Auth/AuthContext";
import { useForm } from "react-hook-form";
import axiosInstance from "../Api/axios";

const CartoonCharacterRegister = () => {
  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      rotate: [0, 15, -15, 15, 0],
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
    });
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      className="mx-auto mb-6 w-24 h-24 rounded-full bg-yellow-400 shadow-2xl flex items-center justify-center"
      title="Welcome! Register here"
    >
      <div className="relative w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center">
        <div className="flex justify-between w-10 absolute top-5 left-3">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="w-3 h-3 bg-black rounded-full"></div>
        </div>
        <div className="w-6 h-1 bg-black rounded-b-full absolute bottom-6 left-5"></div>
        <motion.div
          animate={{ rotate: [0, 20, -20, 20, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-6 bg-pink-500 rounded-full absolute top-1 right-0 shadow-lg"
          style={{ transformOrigin: "bottom center" }}
        />
      </div>
    </motion.div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createUser, createUserWithGoogle, updateUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const upsertUserToDB = async (user) => {
    try {
      await axiosInstance.post("/users/upsert", {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } catch (err) {
      console.error("User upsert failed:", err);
      toast.error("Could not save user to DB");
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password, photoUrl } = data;

    if (!/[A-Z]/.test(password)) return toast.error("At least one uppercase letter required");
    if (!/[a-z]/.test(password)) return toast.error("At least one lowercase letter required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      await updateUser({ displayName: name, photoURL: photoUrl });

      await upsertUserToDB({
        email: user.email,
        displayName: name,
        photoURL: photoUrl || "",
      });

      toast.success("Account created successfully!");
      navigate(location?.state || "/");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await createUserWithGoogle();
      const user = result.user;

      await upsertUserToDB({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL || "",
      });

      toast.success(`Welcome ${user.displayName}`);
      navigate(location?.state || "/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-indigo-600 to-cyan-500 p-4 sm:p-6 transition-colors"
    >
      <CartoonCharacterRegister />

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl p-6 sm:p-8 text-gray-900 dark:text-white transition-colors">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Register
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm sm:text-base transition-colors bg-white dark:bg-[#2D2F36] text-gray-900 dark:text-white"
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-600 text-xs sm:text-sm">{errors.name.message}</p>}

          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm sm:text-base transition-colors bg-white dark:bg-[#2D2F36] text-gray-900 dark:text-white"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
            })}
          />
          {errors.email && <p className="text-red-600 text-xs sm:text-sm">{errors.email.message}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm sm:text-base transition-colors bg-white dark:bg-[#2D2F36] text-gray-900 dark:text-white"
              {...register("password", { required: "Password is required" })}
            />
            <span
              onClick={togglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
            {errors.password && <p className="text-red-600 text-xs sm:text-sm">{errors.password.message}</p>}
          </div>

          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm sm:text-base transition-colors bg-white dark:bg-[#2D2F36] text-gray-900 dark:text-white"
            type="url"
            placeholder="Photo URL (Optional)"
            {...register("photoUrl")}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-primary dark:bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition text-sm sm:text-base"
          >
            Register
          </motion.button>
        </form>

        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 w-full bg-white dark:bg-gray-700 text-darkText dark:text-white border p-3 rounded-lg flex items-center justify-center gap-2 shadow hover:shadow-lg transition font-semibold text-sm sm:text-base"
        >
          <FcGoogle size={24} />
          Register with Google
        </motion.button>

        <p className="mt-4 text-center text-gray-900 dark:text-white text-xs sm:text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary dark:text-indigo-400 font-medium underline">
            Login here
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
