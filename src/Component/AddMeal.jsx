import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";
import axiosInstance from "../Api/axios";
import Swal from "sweetalert2";

const AddMeal = () => {
  const { user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const IMAGEBB_API_KEY = "4794f23cddfe3b9c5c2c2c6797bc5878";

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const uploadImageToImageBB = async (imageFile) => {
    const base64Image = await convertToBase64(imageFile);
    const formData = new FormData();
    formData.append("image", base64Image);
    const url = `https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`;
    const response = await axios.post(url, formData);
    if (response.data?.data?.url) return response.data.data.url;
    throw new Error("Failed to upload image");
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      const imageFile = data.image[0];
      const imageUrl = await uploadImageToImageBB(imageFile);

      const payload = {
        title: data.title,
        category: data.category,
        image: imageUrl,
        ingredients: data.ingredients,
        description: data.description,
        price: parseFloat(data.price),
        postTime: data.postTime,
        distributorName: user.displayName || "Admin",
        addedByEmail: user.email,
      };

      const response = await axiosInstance.post(
        `${import.meta.env.REACT_APP_API_BASE_URL || "https://hotel-server-side-beta.vercel.app"}/meals`,
        payload
      );

      if (response.data.success) {
        Swal.fire("Success!", "Meal added successfully", "success");
        reset();
      } else {
        Swal.fire("Error", "Failed to add meal", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Common input/textarea styles
  const inputClass =
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary " +
    "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 " +
    "border-gray-300 dark:border-gray-600";

  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
        Add New Meal
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter meal title"
            className={`${inputClass} ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            defaultValue=""
            className={`${inputClass} ${errors.category ? "border-red-500" : ""}`}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
          </select>
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            className="w-full text-gray-900 dark:text-gray-100"
          />
          {errors.image && <p className={errorClass}>{errors.image.message}</p>}
        </div>

        {/* Ingredients */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Ingredients <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            {...register("ingredients", { required: "Ingredients are required" })}
            placeholder="Separate ingredients by commas"
            className={`${inputClass} ${errors.ingredients ? "border-red-500" : ""}`}
          />
          {errors.ingredients && <p className={errorClass}>{errors.ingredients.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            {...register("description", { required: "Description is required" })}
            placeholder="Describe the meal"
            className={`${inputClass} ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Price (USD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            placeholder="Enter price in USD"
            className={`${inputClass} ${errors.price ? "border-red-500" : ""}`}
          />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>

        {/* Post Time */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Post Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register("postTime", { required: "Post time is required" })}
            className={`${inputClass} ${errors.postTime ? "border-red-500" : ""}`}
          />
          {errors.postTime && <p className={errorClass}>{errors.postTime.message}</p>}
        </div>

        {/* Distributor & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
              Distributor Name
            </label>
            <input
              type="text"
              value={user.displayName || ""}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">Email</label>
            <input
              type="email"
              value={user.email || ""}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-200
            ${isSubmitting || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 dark:bg-indigo-600 dark:hover:bg-indigo-500"}
          `}
        >
          {uploading ? "Uploading..." : "Add Meal"}
        </button>
      </form>
    </div>
  );
};

export default AddMeal;
